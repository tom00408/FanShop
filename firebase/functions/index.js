/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// IONOS SMTP-Zugangsdaten (bitte ausfüllen!)
const IONOS_USER = "DEINE_IONOS_EMAIL@deinedomain.de";
const IONOS_PASS = "DEIN_IONOS_MAIL_PASSWORT";

const transporter = nodemailer.createTransport({
  host: 'smtp.ionos.de',
  port: 587, // oder 465 für SSL
  secure: false, // true für Port 465, false für 587
  auth: {
    user: IONOS_USER,
    pass: IONOS_PASS
  }
});

exports.sendInvoice = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Nur POST erlaubt');
  }
  const { email, name, address, pdf } = req.body;
  if (!email || !name || !address || !pdf) {
    return res.status(400).send('Fehlende Felder');
  }
  const mailOptions = {
    from: IONOS_USER,
    to: email,
    subject: 'Ihre Rechnung vom MTV Geismar Shop',
    text: `Hallo ${name},\n\nim Anhang finden Sie Ihre Rechnung.\n\nAdresse: ${address}`,
    attachments: [
      {
        filename: 'rechnung.pdf',
        content: Buffer.from(pdf, 'base64'),
        contentType: 'application/pdf'
      }
    ]
  };
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send('Mail sent');
  } catch (err) {
    logger.error('Mail failed', err);
    res.status(500).send('Mail failed: ' + err.toString());
  }
});
