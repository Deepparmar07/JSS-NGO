const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendContactEmail, sendDonationReceipt, sendVolunteerEmail } = require('./email');

dotenv.config();

const app = express();
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'https://jssngo.netlify.app')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: allowedOrigins,
  allowedHeaders: ['Content-Type', 'x-admin-api-key'],
}));
app.use(express.json({ limit: '20kb' }));

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  pan: String,
  amount: { type: Number, required: true },
  paymentId: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Donation = mongoose.model('Donation', donationSchema);

function getRazorpay() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = process.env;
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    const error = new Error('Razorpay is not configured on the server');
    error.status = 503;
    throw error;
  }
  return new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
}

function requireDatabase() {
  if (mongoose.connection.readyState !== 1) {
    const error = new Error('Donation storage is temporarily unavailable');
    error.status = 503;
    throw error;
  }
}

function validateRequiredText(value, field, maxLength = 200) {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > maxLength) {
    const error = new Error(`${field} is required and must be under ${maxLength} characters`);
    error.status = 400;
    throw error;
  }
  return value.trim();
}

function validateEmail(value) {
  const email = validateRequiredText(value, 'A valid email address', 254);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const error = new Error('A valid email address is required');
    error.status = 400;
    throw error;
  }
  return email;
}

function secureStringEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api/config', (req, res) => {
  res.json({ razorpayKeyId: process.env.RAZORPAY_KEY_ID || null });
});

app.post('/api/create-order', async (req, res) => {
  try {
    requireDatabase();
    const amount = Number(req.body.amount);
    if (!Number.isSafeInteger(amount) || amount < 100 || !Number.isSafeInteger(amount * 100)) {
      return res.status(400).json({ error: 'Donation amount must be a whole number of at least INR 100' });
    }

    const order = await getRazorpay().orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `jss_${Date.now()}`,
    });
    res.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message);
    res.status(error.status || 500).json({ error: error.status ? error.message : 'Unable to create payment order' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_signature: signature,
      name,
      email,
      phone,
      pan,
      amount,
    } = req.body;

    const donor = {
      name: validateRequiredText(name, 'Name', 200),
      email: validateEmail(email),
      phone: validateRequiredText(phone, 'Phone number', 40),
      pan: typeof pan === 'string' ? pan.trim().slice(0, 20) : '',
      amount: Number(amount),
    };
    if (!paymentId || !orderId || typeof signature !== 'string' ||
        !Number.isSafeInteger(donor.amount) || donor.amount < 100 ||
        !Number.isSafeInteger(donor.amount * 100)) {
      return res.status(400).json({ error: 'Invalid payment or donation details' });
    }

    const razorpay = getRazorpay();
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');
    if (!/^[a-f0-9]{64}$/i.test(signature) || !secureStringEqual(expectedSignature, signature)) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    requireDatabase();
    const order = await razorpay.orders.fetch(orderId);
    if (order.amount !== donor.amount * 100 || order.currency !== 'INR') {
      return res.status(400).json({ error: 'Payment amount does not match the order' });
    }

    let payment = await razorpay.payments.fetch(paymentId);
    if (payment.order_id !== orderId || payment.amount !== donor.amount * 100 ||
        payment.currency !== 'INR') {
      return res.status(400).json({ error: 'Payment details do not match the order' });
    }
    if (payment.status === 'authorized') {
      payment = await razorpay.payments.capture(paymentId, donor.amount * 100, 'INR');
    }
    if (payment.status !== 'captured') {
      return res.status(400).json({ error: 'Payment has not been captured' });
    }

    const existingDonation = await Donation.findOne({ paymentId });
    if (existingDonation) {
      return res.json({ success: true, emailSent: false });
    }

    await Donation.create({
      ...donor,
      paymentId,
      status: 'completed',
    });

    let emailSent = false;
    try {
      await sendDonationReceipt({ ...donor, paymentId });
      emailSent = true;
    } catch (emailError) {
      console.error('Donation saved, but receipt email could not be sent:', emailError.message);
    }

    res.json({ success: true, emailSent });
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(error.status || 500).json({ error: error.status ? error.message : 'Unable to verify payment' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    await sendContactEmail({
      firstName: validateRequiredText(req.body.firstName, 'First name', 100),
      lastName: typeof req.body.lastName === 'string' ? req.body.lastName.trim().slice(0, 100) : '',
      email: validateEmail(req.body.email),
      phone: typeof req.body.phone === 'string' ? req.body.phone.trim().slice(0, 40) : '',
      message: validateRequiredText(req.body.message, 'Message', 5000),
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending contact message:', error.message);
    res.status(error.status || 500).json({ error: error.status ? error.message : 'Unable to send your message' });
  }
});

app.post('/api/volunteers', async (req, res) => {
  try {
    await sendVolunteerEmail({
      name: validateRequiredText(req.body.name, 'Name', 200),
      email: validateEmail(req.body.email),
      phone: validateRequiredText(req.body.phone, 'Phone number', 40),
      address: validateRequiredText(req.body.address, 'Address', 500),
      skills: validateRequiredText(req.body.skills, 'Skills', 2000),
      about: validateRequiredText(req.body.about, 'About you', 3000),
      contribution: validateRequiredText(req.body.contribution, 'How you can contribute', 3000),
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error sending volunteer form:', error.message);
    res.status(error.status || 500).json({ error: error.status ? error.message : 'Unable to submit your form' });
  }
});

app.get('/api/donations', async (req, res) => {
  try {
    const adminApiKey = process.env.ADMIN_API_KEY;
    const providedKey = req.get('x-admin-api-key') || '';
    if (!adminApiKey) {
      return res.status(503).json({ error: 'Donations administration is not configured' });
    }
    if (!secureStringEqual(adminApiKey, providedKey)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    requireDatabase();
    const donations = await Donation.find().sort({ createdAt: -1 }).lean();
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error.message);
    res.status(error.status || 500).json({ error: error.status ? error.message : 'Unable to fetch donations' });
  }
});

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('MONGODB_URI environment variable is required; database-backed endpoints will be unavailable');
} else {
  mongoose.connect(mongoUri)
    .then((connection) => console.log(`MongoDB Connected: ${connection.connection.host}`))
    .catch((error) => console.error('MongoDB connection error:', error.message));
}

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected from MongoDB');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down`);
  server.close();
  await mongoose.connection.close();
  process.exit(0);
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
