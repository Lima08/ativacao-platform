import nodemailer from 'nodemailer'

import { IEmailService } from './types'

export default class EmailService implements IEmailService {
  private static instance: EmailService
  // constructor() {

  // }
  public static getInstance(): EmailService {
    if (!this.instance) {
      this.instance = new EmailService()
    }
    return this.instance
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      // secure: true, // use SSL
      auth: {
        user: '',
        pass: ''
      }
      // tls: {
      //   rejectUnauthorized: false
      // },
      // debug: true,
      // logger: true,
      // pool: true,
      // maxConnections: 5,
      // maxMessages: 100,
      // rateDelta: 1000,
      // rateLimit: 5,
      // rateLimitInterval: 1000,
      // connectionTimeout: 1000,
      // greetingTimeout: 1000,
      // socketTimeout: 1000,
      // closeTimeout: 1000,
      // authTimeout: 1000,
      // messageTimeout: 1000,
      // proxy: 'http://localhost:3000',
    })

    const mailOptions = {
      from: 'seu_email@example.com',
      to,
      subject,
      text: 'Hello world?',
      html: '<b>Hello world?</b>' // content??
      // attachments: [],
      // messageId: '',
      // inReplyTo: '',
      // references: '',
      // envelope: '',
      // headers: '',
      // priority: '',
      // dsn: '',
    }

    await transporter.sendMail(mailOptions)
  }
}
