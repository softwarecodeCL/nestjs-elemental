import { Injectable, Logger } from '@nestjs/common';
import { IMailService, mailParams } from '../core/interfaces/index.interface';
import * as aws from '@aws-sdk/client-ses';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';


@Injectable()
export class AppService implements IMailService {
  private ses: aws.SES;
  private transporter: nodemailer.Transporter;

  private readonly logger = new Logger(AppService.name);

  constructor(private readonly configService: ConfigService) {
    this.ses = new aws.SES({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    this.transporter = nodemailer.createTransport({
      SES: { aws, ses: this.ses },
    });
  }

  async sendMail(params: mailParams) {
    const { to, subject, text, attachments, html } = params;

    const mailOptions = {
      from: this.configService.getOrThrow<string>('AWS_SES_FROM'),
      to,
      subject,
      text,
      html,
      attachments,
    };

    try {
      await this.transporter.sendMail(mailOptions as any);
      this.logger.log(
        'Email sent',
        JSON.stringify({
          ...mailOptions,
          attachments: undefined,
          html: undefined,
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
