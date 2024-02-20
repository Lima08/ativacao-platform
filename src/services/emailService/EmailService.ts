import Handlebars from 'handlebars'
import nodemailer from 'nodemailer'

import { IEmailService } from './types'

export default class EmailService implements IEmailService {
  private static instance: EmailService
  public static getInstance(): EmailService {
    if (!this.instance) {
  
      this.instance = new EmailService()
    }
    return this.instance
  }

  compileTemplate(template: string, data: any): string {
    const handlebarsTemplate = Handlebars.compile(template)
    return handlebarsTemplate(data)
  }

  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      // @ts-ignore
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // TODO: use SSL - change to true
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html: content
    }
    await transporter.sendMail(mailOptions)
  }

  async sendEmailBulk(
    to: string[],
    subject: string,
    content: string
  ): Promise<void> {
    const promisesBulk = to.map((email) =>
      this.sendEmail(email, subject, content)
    )
    await Promise.all(promisesBulk)
  }
}
