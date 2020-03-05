const nodemailer = require("nodemailer");

const _from = "Modern Portfolio <contact@modernportfolio.com>";

setup = () => {
  return nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "7985d337b6a37b",
      pass: "4b47da9694c0c1"
    }
  });
};

sendConfirmationEmail = user => {
  const transport = setup();
  const email = {
    _from,
    to: user.email,
    subject: "Welcome to Modern Portfolio",
    text: `
      Welcome to Modern Portfolio. Please, confirm your email.
      ${`localhost:3000/confirmation/${user.confirmationJWT}`}
      `
  };

  transport.sendMail(email);
};

sendResetPasswordLink = user => {
  const transport = setup();

  const email = {
    _from,
    to: user.email,
    subject: "Reset Password",
    text: `
    To reset password follow this link
    ${`localhost:3000/reset/${user.resetJWT}`}
    `
  };

  transport.sendMail(email);
};

module.exports = { sendConfirmationEmail, sendResetPasswordLink };
