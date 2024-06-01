const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
   secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const sendNotification = (medication) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: medication.user.email,
      subject: 'Medication Reminder',
      text: `This is a reminder to take your medication: ${medication.medicine_name}. Description: ${medication.description}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Email: ",process.env.EMAIL_USER);
        console.log("Password: ",process.env.EMAIL_PASS);
        console.log("Receiver: ", medication.user.email);
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  };

  module.exports = { sendNotification };