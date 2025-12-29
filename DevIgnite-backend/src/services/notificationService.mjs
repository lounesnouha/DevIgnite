import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, 
      auth: {
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendPostNotification(recipients, postData, departmentName) {
    try {
      const { title, content, link } = postData;
      
      const mailOptions = {
        from: `"DevIgnite" <${process.env.SMTP_USER}>`,
        to: recipients.join(', '),
        subject: `Nouveau post dans ${departmentName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;"> DevIgnite - Nouveau Post</h2>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
              <h3 style="color: #0066cc;">${title}</h3>
              <p style="color: #666; line-height: 1.6;">${content.substring(0, 200)}${content.length > 200 ? '...' : ''}</p>
              <p style="margin-top: 20px;">
                <strong>Département:</strong> ${departmentName}
              </p>
            </div>
            <div style="margin-top: 20px; text-align: center;">
              <a href="${link}" style="background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Voir le post complet
              </a>
            </div>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
              Vous recevez cet email car vous suivez le département ${departmentName} sur DevIgnite.
            </p>
          </div>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email envoyé:', info.messageId);
      return { success: true, messageId: info.messageId };
      
    } catch (error) {
      console.error('Erreur envoi email:', error);
      throw error;
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Serveur email prêt');
      return true;
    } catch (error) {
      console.error('Erreur connexion serveur email:', error);
      return false;
    }
  }
}

export default new NotificationService();