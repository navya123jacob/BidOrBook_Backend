import nodemailer from 'nodemailer';

class sendMail {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'navyatjacob@gmail.com',
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendVerificationEmail(email: string, verificationToken: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'navyatjacob@gmail.com',
      to: email,
      subject: ' Email Verification',
      text: `${email}, your verification code is: ${verificationToken}. Do not share this code with anyone.`,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log('Verification code sent');
          resolve();
        }
      });
    });
  }
}

export default sendMail;