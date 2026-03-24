import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('MAIL_HOST') || 'smtp.gmail.com',
      port: this.configService.get('MAIL_PORT') || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get('MAIL_USER') || 'placeholder@gmail.com',
        pass: this.configService.get('MAIL_PASS') || 'placeholder_pass',
      },
    });
  }

  async sendTemporaryPassword(email: string, firstName: string, temporaryPassword: string, employeeNumber: string) {
    const from = this.configService.get('MAIL_FROM') || '"EPDS System" <noreply@sdo.gov.ph>';
    const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';

    const info = await this.transporter.sendMail({
      from,
      to: email,
      subject: 'Welcome to EPDS! Your Temporary Account Credentials',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Welcome, ${firstName || 'Employee'}!</h2>
          <p>Your system account for the <strong>Employment Personal Data System (EPDS)</strong> has been successfully provisioned.</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 0.9em; color: #6b7280; text-transform: uppercase;">Employee Number</p>
            <p style="margin: 5px 0 15px 0; font-family: monospace; font-size: 1.5em; font-weight: bold; letter-spacing: 2px;">${employeeNumber}</p>
            
            <p style="margin: 0; font-size: 0.9em; color: #6b7280; text-transform: uppercase;">Temporary Password</p>
            <p style="margin: 5px 0 0 0; font-family: monospace; font-size: 1.5em; font-weight: bold; letter-spacing: 2px;">${temporaryPassword}</p>
          </div>
          
          <p style="color: #ef4444; font-size: 0.85em;"><strong>IMPORTANT:</strong> You will be required to change your password upon your first login to ensure account security.</p>
          
          <div style="margin-top: 30px; text-align: center;">
            <a href="${frontendUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Login to EPDS</a>
          </div>
          
          <p style="margin-top: 40px; font-size: 0.8em; color: #9ca3af; border-top: 1px solid #efefef; pt: 20px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    return info;
  }
}
