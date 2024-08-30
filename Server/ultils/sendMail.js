const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendMail = asyncHandler(async ({ email, html, subject }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_NAME,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Vieen Store" <no-reply@vienstore.com>', // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: html, // html body
    });
    return info;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send email');
  }
});

module.exports = sendMail;
