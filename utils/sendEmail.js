const fs = require('fs');
const htmlToText = require('html-to-text');
const nodemailer = require('nodemailer');
const https = require('https');

module.exports = class Email {
  constructor(user, otp,amount,renewalDate,expiryDate,maskedPan) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.otp = otp;
    this.amount=amount;
    this.renewalDate=renewalDate;
    this.expiryDate=expiryDate;
    this.maskedPan=maskedPan;
    this.from = process.env.EMAIL_FROM;
  }

  async send(template, subject) {
    let html = fs.readFileSync(`${__dirname}/../views/emails/${template}.html`, 'utf-8');
    html = html.replace('{{firstName}}', this.firstName).replace('{{otp}}', this.otp)
    .replace('{{otp}}', this.otp || '')
  .replace('{{amount}}', this.amount || '')
  .replace('{{renewalDate}}', this.renewalDate || '')
  .replace('{{expiryDate}}', this.expiryDate || '')
  .replace('{{maskedPan}}', this.maskedPan || '')
    ;
    const textContent = htmlToText.convert(html);

    try {
      if (process.env.NODE_ENV === 'production') {

        const payload = JSON.stringify({
          sender: { email: this.from, name: 'metro' },
          to: [{ email: this.to }],
          subject,
          htmlContent: html,
          textContent
        });

        await new Promise((resolve, reject) => {
          const options = {
            hostname: 'api.brevo.com',
            path: '/v3/smtp/email',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'api-key': process.env.BREVO_API_KEY,
              'Content-Length': Buffer.byteLength(payload)
            }
          };

          const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
              if (res.statusCode >= 200 && res.statusCode < 300) {
                resolve(data);
              } else {
                reject(new Error(`Brevo API error: ${res.statusCode} - ${data}`));
              }
            });
          });

          req.on('error', reject);
          req.write(payload);
          req.end();
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

        await transporter.sendMail({
          to: this.to,
          from: this.from,
          subject,
          html,
          text: textContent
        });

      }
    } catch (err) {
      if (err.response && err.response.body) {
        console.error('Email send error response body:', err.response.body);
      } else {
        console.error('Email send error:', err);
      }
      throw new Error('There was an error sending the email. Try again later!');
    }
  }

  async sendResetPassword() {
    await this.send('resetPassEmail', 'Your Password reset OTP valid for only 10 minutes');
  }

  async sendOTP() {
    await this.send('sendOTP', 'Send OTP verification');
  }
  async sendSubscriptionReminder() {
  await this.send('subscriptionReminder', 'Metro Mate - تذكير بتجديد اشتراكك');
}

async sendRenewalFailed() {
  await this.send('subscriptionRenewalFailed', 'Metro Mate - فشل تجديد اشتراكك');
}
async sendSubscriptionRenewed() {
  await this.send('subscriptionRenewed', 'Metro Mate - Your Subscription Has Been Renewed ✅');
}
async sendSubscriptionExpired() {
  await this.send('subscriptionExpired', 'Metro Mate - Your Subscription Has Expired');
}
};
