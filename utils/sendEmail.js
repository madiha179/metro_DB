const fs = require('fs');
const htmlToText = require('html-to-text');
const { MailerSend, EmailParams, Recipient, Sender } = require("mailersend");

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

    const mailerSend = new MailerSend({
      api_key: process.env.MAILERSEND_API_KEY
    });

    const recipients = [ new Recipient(this.to) ];

    const emailParams = new EmailParams()
      .setFrom(new Sender(this.from, "Metro Mate"))
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(html)
      .setText(htmlToText.convert(html));

    await mailerSend.email.send(emailParams);
  }

  async sendWelcome() {
    await this.send('Welcome', 'Welcome To Metro Mate App');
  }

  async sendResetPassword() {
    await this.send('resetPassEmail', 'Your Password reset Token valid for only 10 minutes');
  }
};
