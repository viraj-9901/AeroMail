import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { EmailJobData } from '../../types/express';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export const sendEmail = async (data: EmailJobData): Promise<void> => {
  const msg = {
    to: data.userEmail,
    from: process.env.SENDGRID_FROM_EMAIL as string,
    subject: data.subject,
    html: data.html,
  };
  try {
    await sgMail.send(msg);
    console.log('Email sent successfully to', data.userEmail);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};