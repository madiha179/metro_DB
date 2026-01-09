const fs = require('fs');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const Brevo = require('@getbrevo/brevo');

module.exports = class Email {
  constructor(user, otp) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.otp = otp;
    this.from = process.env.EMAIL_FROM;
  }

  async send(template, subject) {
    let html = fs.readFileSync(`${__dirname}/../views/emails/${template}.html`, 'utf-8');
    html = html.replace('{{firstName}}', this.firstName).replace('{{otp}}', this.otp);
    const textContent = htmlToText.convert(html);

    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      html,
      text: textContent
    };

    try {
      if (process.env.NODE_ENV === 'production') {
        const apiInstance = new Brevo.TransactionalEmailsApi();
        const sendSmtpEmail = {
          sender: { email: this.from, name: 'metro' },
          to: [{ email: this.to }],
          subject,
          htmlContent: html,
          textContent
        };
        await apiInstance.sendTransacEmail(sendSmtpEmail, undefined, {
          apiKey: process.env.BREVO_API_KEY
        });
      } else {
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
          }
        });

        await transporter.sendMail(mailOptions);
      }

    } catch (err) {
      console.error('Email send error:', err.response ? err.response.body : err);
      throw new Error('There was an error sending the email. Try again later!');
    }
  }

  async sendResetPassword() {
    await this.send('resetPassEmail', 'Your Password reset OTP valid for only 10 minutes');
  }

  async sendOTP() {
    await this.send('sendOTP', 'Send OTP verification');
  }
};
