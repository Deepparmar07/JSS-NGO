const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Razorpay = require('razorpay');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Load environment variables
dotenv.config();

// Set MONGODB_URI in the environment; do not commit database credentials.
const uri = process.env.MONGODB_URI;

// Razorpay Configuration
const razorpayConfig = {
  key_id: 'your_razorpay_key_id', // Replace with your actual Razorpay key ID
  key_secret: 'your_razorpay_key_secret' // Replace with your actual Razorpay key secret
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Connect to MongoDB
connectDB();

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from MongoDB Atlas');
});

// Handle application termination
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during MongoDB connection closure:', err);
    process.exit(1);
  }
});

// Razorpay instance
const razorpay = new Razorpay(razorpayConfig);

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com', // Replace with your email
    pass: 'your_email_app_password' // Replace with your email app password
  }
});

// Donation Schema
const donationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  pan: String,
  amount: Number,
  paymentId: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

const Donation = mongoose.model('Donation', donationSchema);

// Routes
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 1,
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

app.post('/api/verify-payment', async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      name,
      email,
      phone,
      pan,
      amount
    } = req.body;

    // Verify signature
    const generated_signature = crypto
      .createHmac('sha256', razorpayConfig.key_secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Save donation to database
      const donation = new Donation({
        name,
        email,
        phone,
        pan,
        amount,
        paymentId: razorpay_payment_id,
        status: 'completed'
      });
      await donation.save();

      // Send email receipt
      const mailOptions = {
        from: 'evilsocket19@gmail.com',
        to: email,
        subject: 'Thank you for your donation to JSS NGO',
        html: `
          <h1>Thank you for your donation!</h1>
          <p>Dear ${name},</p>
          <p>Thank you for your generous donation of ₹${amount} to JSS NGO.</p>
          <p>Payment ID: ${razorpay_payment_id}</p>
          <p>This email serves as your donation receipt.</p>
          <p>Best regards,<br>JSS NGO Team</p>
        `
      };

      await transporter.sendMail(mailOptions);

      res.json({ success: true });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Error verifying payment' });
  }
});

// Get all donations (admin route)
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Error fetching donations' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
