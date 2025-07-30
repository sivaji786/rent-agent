import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.setupTransporter();
  }

  private setupTransporter() {
    // Check if email credentials are configured
    const emailHost = process.env.SMTP_HOST;
    const emailPort = process.env.SMTP_PORT;
    const emailUser = process.env.SMTP_USER;
    const emailPass = process.env.SMTP_PASS;

    if (!emailHost || !emailPort || !emailUser || !emailPass) {
      console.log('Email credentials not configured. Password reset emails will be logged to console.');
      return;
    }

    const config: EmailConfig = {
      host: emailHost,
      port: parseInt(emailPort),
      secure: parseInt(emailPort) === 465, // true for 465, false for other ports
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    };

    this.transporter = nodemailer.createTransporter(config);
  }

  async sendPasswordResetEmail(email: string, resetToken: string, firstName?: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'Reset Your Prolits Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          ${firstName ? `<p>Hi ${firstName},</p>` : '<p>Hello,</p>'}
          <p>You requested to reset your password for your Prolits account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">This email was sent from Prolits Property Management System.</p>
        </div>
      `,
      text: `
        Password Reset Request
        
        ${firstName ? `Hi ${firstName},` : 'Hello,'}
        
        You requested to reset your password for your Prolits account. 
        
        Please visit the following link to set a new password:
        ${resetUrl}
        
        This link will expire in 24 hours.
        
        If you didn't request this password reset, you can safely ignore this email.
      `
    };

    if (this.transporter) {
      try {
        const info = await this.transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
      } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw new Error('Failed to send reset email');
      }
    } else {
      // Log email content to console for development
      console.log('\n=== PASSWORD RESET EMAIL (Development Mode) ===');
      console.log(`To: ${email}`);
      console.log(`Subject: ${mailOptions.subject}`);
      console.log(`Reset URL: ${resetUrl}`);
      console.log('===============================================\n');
      
      return { success: true, messageId: 'dev-mode-' + Date.now() };
    }
  }

  async testConnection(): Promise<boolean> {
    if (!this.transporter) {
      return false;
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();