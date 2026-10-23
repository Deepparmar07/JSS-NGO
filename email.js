const nodemailer = require('nodemailer');

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    const error = new Error('Email is not configured on the server');
    error.status = 503;
    throw error;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass },
  });
}

async function sendEmail({ subject, replyTo, html, to }) {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to || process.env.CONTACT_EMAIL || process.env.EMAIL_USER,
    replyTo,
    subject,
    html,
  });
}

function detail(label, value) {
  return `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`;
}

function sendContactEmail({ firstName, lastName, email, phone, message }) {
  return sendEmail({
    subject: `Website contact from ${firstName} ${lastName}`,
    replyTo: email,
    html: [
      '<h2>New website contact message</h2>',
      detail('Name', `${firstName} ${lastName}`),
      detail('Email', email),
      detail('Phone', phone || 'Not provided'),
      detail('Message', message).replace(/\n/g, '<br>'),
    ].join(''),
  });
}

function sendVolunteerEmail({ name, email, phone, address, skills, about, contribution }) {
  return sendEmail({
    subject: `Volunteer application from ${name}`,
    replyTo: email,
    html: [
      '<h2>New volunteer application</h2>',
      detail('Name', name),
      detail('Email', email),
      detail('Phone', phone),
      detail('Address', address),
      detail('Skills', skills),
      detail('About', about),
      detail('How they can contribute', contribution),
    ].join(''),
  });
}

function sendDonationReceipt({ name, email, amount, paymentId }) {
  return sendEmail({
    subject: 'Thank you for your donation to JSS NGO',
    replyTo: undefined,
    html: [
      `<h1>Thank you for your donation, ${escapeHtml(name)}!</h1>`,
      `<p>We received your donation of INR ${escapeHtml(amount)}.</p>`,
      `<p>Payment ID: ${escapeHtml(paymentId)}</p>`,
      `<p>This email is your payment receipt.</p>`,
    ].join(''),
    to: email,
  });
}

module.exports = {
  sendContactEmail,
  sendDonationReceipt,
  sendVolunteerEmail,
};
