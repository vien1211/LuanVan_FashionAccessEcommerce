const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendMail = asyncHandler(async ({ email, html, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.MAIL_NAME,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Vieen Store" <no-reply@vienstore.com>', 
      to: email, 
      subject: subject, 
      html: html, 
      text: text
    });
    return info;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send email');
  }
});

module.exports = sendMail;

// In sendMail.js
// const nodemailer = require('nodemailer');

// const sendMail = async ({ email, subject, text, html }) => {
//     const transporter = nodemailer.createTransport({
//         service: 'gmail', // Dịch vụ email bạn đang sử dụng
//         auth: {
//             user: process.env.MAIL_NAME,
//             pass: process.env.MAIL_APP_PASSWORD,
//         },
//     });

//     const mailOptions = {
//         from: process.env.MAIL_NAME,
//         to: email,
//         subject,
//         text,
//         html, // Sử dụng HTML nếu cần
//     };

//     return new Promise((resolve, reject) => {
//         transporter.sendMail(mailOptions, (error, info) => {
//             if (error) {
//                 console.error('Error sending email:', error);
//                 return reject(error);
//             }
//             console.log('Email sent:', info.response);
//             resolve(info);
//         });
//     });
// };

// module.exports = sendMail;





