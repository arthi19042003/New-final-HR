// server/utils/emailService.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // app password
  },
});

/**
 * Send onboarding notification emails.
 */
async function sendOnboardingEmail(to, subject, text) {
  const mailOptions = {
    from: `"Smart Submissions" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📨 Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error("❌ Failed to send email:", err.message);
  }
}

module.exports = { sendOnboardingEmail };
