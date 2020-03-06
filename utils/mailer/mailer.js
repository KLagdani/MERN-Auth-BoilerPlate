require("dotenv").config();
const nodemailer = require("nodemailer");

setup = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });
};

sendConfirmationEmail = async user => {
  const transport = setup();
  const email = {
    from: "contact@promelio.com",
    to: user.email,
    subject: "Welcome to Promelio",
    text: `
      Welcome to Modern Portfolio. Please, confirm your email.
      ${`localhost:80/confirmation/${user.confirmationJWT}`}
      `
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(email, (err, data) => {
      if (err) {
        console.error("Mail not sent", err);
        resolve("fail");
      } else {
        console.log(`Email sent to ${user.email}`);
        resolve("success");
      }
    });
  });
};

sendResetPasswordLink = user => {
  const transport = setup();

  const email = {
    from: "contact@promelio.com",
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
