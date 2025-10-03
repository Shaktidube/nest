// src/mail/mail.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL.HOST'),
      port: this.configService.get<number>('EMAIL.PORT'),
      auth: {
        user: this.configService.get<string>('EMAIL.USER'),
        pass: this.configService.get<string>('EMAIL.PASS'),
      },
    });
  }

  send(templateName: string, data: any, mailOptions: any) {
    try {
      const emailTemplatePath = path.join(
        process.cwd(),
        'src',
        'mail',
        'templates',
      );
      const template = fs.readFileSync(
        path.join(emailTemplatePath, templateName),
        'utf-8',
      );

      const emailBody = ejs.render(template, data);

      mailOptions.html = emailBody;

      return this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email send error:', error);
      throw new InternalServerErrorException('Email could not be sent');
    }
  }
}
