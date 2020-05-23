const nodemailer = require('nodemailer');

const sendEmailTo = async (email) => {
  try {
    const account = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: account.user, pass: account.pass },
    });

    const mailOptions = {
      from: 'test@example.com',
      to: email,
      subject: 'Test Email',
      text: 'You are subscribed successfully.',
      html: '<b>You are subscribed successfully.</b>',
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    throw error;
  }
};

module.exports = { sendEmailTo };
