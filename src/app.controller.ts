
import { AppService } from './app.service';
import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SendEmailDto } from './send-email.dto';

@Controller('api/v1/email')
export class AppController {
  constructor(private readonly mailService: AppService) {}

  @Post('send')
  async sendEmail(@Body() body: SendEmailDto) {
    const { to, subject, text } = body;
    console.log('Request Body:', body);
    try {
      /*await this.mailService.sendMail({
        to,
        subject,
        text,
      }); */
      return { message: 'Email sent successfully ' + to };
    } catch (error) {
      // Optionally log the error or handle it accordingly
      throw new HttpException('Failed to send email', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
