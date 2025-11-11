const nodemailer = require('nodemailer');
const fs = require('fs');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Metro Mate <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD
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

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome To Metro Mate App');
  }

  async sendResetPassword() {
    await this.send('resetPassEmail', 'Your Password reset Token valid for only 10 minutes');
  }
};