const nodemailer = require('nodemailer');
const { DateTime } = require('luxon');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, content, timeZone = 'UTC') => {
  const formattedDate = DateTime.now().setZone(timeZone).toLocaleString(DateTime.DATETIME_FULL);
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #F8F9FA; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; background-color: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { background-color: #007BFF; padding: 20px; text-align: center; }
        .header h1 { color: #FFFFFF; margin: 0; font-size: 28px; font-weight: bold; }
        .content { padding: 20px; color: #333333; }
        .content p { line-height: 1.6; margin: 10px 0; }
        .content .otp { font-size: 24px; font-weight: bold; color: #007BFF; text-align: center; margin: 20px 0; }
        .content .highlight { color: #007BFF; font-weight: bold; }
        .footer { background-color: #F8F9FA; padding: 10px; text-align: center; color: #666666; font-size: 12px; }
        .footer a { color: #007BFF; text-decoration: none; }
        .button { display: inline-block; padding: 10px 20px; background-color: #007BFF; color: #FFFFFF; text-decoration: none; border-radius: 4px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>ZvertexAI</h1>
        </div>
        <div class="content">
          ${content.replace('{{formattedDate}}', formattedDate)}
        </div>
        <div class="footer">
          <p>© 2025 ZvertexAI. All rights reserved.</p>
          <p><a href="https://zvertexai.com">Visit our website</a> | <a href="mailto:zvertex.247@gmail.com">Contact Us</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };