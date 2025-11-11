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
      host: 'smtp-relay.brevo.com',
      port: 587,
      auth: {
        user: "9b566b001@smtp-brevo.com",
        pass: "xsmtpsib-f925be78b4ad8e2b7f064e5ba0b4521bf8411f0bea5a2f46a00862aa8baa7646-kHMkwkVaB7R7udet"
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