const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendFoundEmail = async (ownerEmail, location) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: ownerEmail,
    subject: '¡Tu mascota ha sido encontrada!',
    html: `<p>Alguien ha escaneado el QR de tu mascota. Ubicación: ${location}</p>`,
  };

  await transporter.sendMail(mailOptions);
};