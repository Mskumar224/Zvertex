const nodemailer = require('nodemailer');
const config = require('config');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.get('emailUser'),
        pass: config.get('emailPass'),
      },
    });

    await transporter.sendMail({
      from: '"ZvertexAI" <support@zvertexai.com>',
      to,
      subject,
      text,
    });
    console.log(`Email sent to ${to}`);
  } catch (err) {
    console.error('Email error:', err);
    throw err;
  }
};

module.exports = { sendEmail };