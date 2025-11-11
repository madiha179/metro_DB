const fs = require('fs');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Production: SendGrid Web API
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      return sgMail;
    }

    // Development: Mailtrap or local SMTP
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    let html = fs.readFileSync(`${__dirname}/../views/emails/${template}.html`, 'utf-8');
    html = html.replace('{{firstName}}', this.firstName).replace('{{url}}', this.url);

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html)
    };

    if (process.env.NODE_ENV === 'production') {
      await this.newTransport().send(mailOptions);
    } else {
      await this.newTransport().sendMail(mailOptions);
    }
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome To Metro Mate App');
  }

  async sendResetPassword() {
    await this.send('resetPassEmail', 'Your Password reset Token valid for only 10 minutes');
  }
};
