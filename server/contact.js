import express from 'express';
import fetch from 'node-fetch';
import { z } from 'zod';

const router = express.Router();

const envSchema = z.object({
  EMAIL_API_URL: z.string().url().default('https://mails.nubcoder.com/api/emails/send-api'),
  EMAIL_API_KEY: z.string({
    required_error: "EMAIL_API_KEY is required",
  }).min(1, "EMAIL_API_KEY cannot be empty"),
  EMAIL_FROM: z.string().email().default('support@nubcoder.com'),
  EMAIL_TO: z.string().email().default('nubcoders@gmail.com'),
});

const envResult = envSchema.safeParse(process.env);

if (!envResult.success) {
  const errors = envResult.error.flatten().fieldErrors;
  console.error('❌ Invalid environment variables in server/contact.js:', errors);
  throw new Error(`Invalid environment variables for email API: ${JSON.stringify(errors)}`);
}

const {
  EMAIL_API_URL,
  EMAIL_API_KEY,
  EMAIL_FROM: FROM_EMAIL,
  EMAIL_TO: TO_EMAIL,
} = envResult.data;

router.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }
  try {
    const response = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'X-Api-Key': EMAIL_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        subject: `Contact Form: ${subject}`,
        text: `\nNew Contact Form Submission\n\nFrom: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}\n        `
      })
    });
    if (!response.ok) {
      return res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
    }
    res.json({ success: true, message: 'Your message has been sent successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'An error occurred while sending your message' });
  }
});

export default router;
