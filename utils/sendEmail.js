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

  async send(template, subject) {
    let html = fs.readFileSync(`${__dirname}/../views/emails/${template}.html`, 'utf-8');
    html = html.replace('{{firstName}}', this.firstName).replace('{{url}}', this.url);

    const mailOptions = {
      to: this.to,
      from: this.from,
      subject,
      html,
      text: htmlToText.convert(html)
    };

    try {
      if (process.env.NODE_ENV === 'production') {
        // SendGrid Web API
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.send(mailOptions);
      } else {
        // Development: Mailtrap/local SMTP
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

  async sendWelcome() {
    await this.send('Welcome', 'Welcome To Metro Mate App');
  }

  async sendResetPassword() {
    await this.send('resetPassEmail', 'Your Password reset Token valid for only 10 minutes');
  }
};
