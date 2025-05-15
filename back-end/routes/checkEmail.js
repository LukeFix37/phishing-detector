import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  const { emailText } = req.body;
  if (!emailText) return res.status(400).json({ error: 'Email text is required' });

  const emailLower = emailText.toLowerCase();

  const phishingFeatures = [
    { phrase: 'verify your account', lr: 5 },
    { phrase: 'click below', lr: 6 },
    { phrase: 'confirm your password', lr: 7 },
    { phrase: 'urgent action required', lr: 8 },
    { phrase: 'account suspended', lr: 9 },
    { phrase: 'login now', lr: 4 },
    { phrase: 'update your information', lr: 5 },
    { phrase: 'security alert', lr: 7 },
  ];

  const urgencyWords = ['immediately', 'urgent', 'asap', 'now', 'attention'];
  const urgencyLR = 3;

  const urlRegex = /https?:\/\/[^\s]+/gi;

  let prior = 0.1;
  let odds = prior / (1 - prior);

  phishingFeatures.forEach(({ phrase, lr }) => {
    if (emailLower.includes(phrase)) {
      odds *= lr;
    }
  });

  urgencyWords.forEach(word => {
    const count = (emailLower.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
    if (count > 0) odds *= Math.pow(urgencyLR, Math.min(count, 3));
  });

  const urls = emailText.match(urlRegex) || [];
  if (urls.length > 0) {
    const urlLR = 4;
    odds *= Math.pow(urlLR, Math.min(urls.length, 3));
  }

  const confidenceProb = odds / (1 + odds);
  const confidence = Math.min(Math.round(confidenceProb * 100), 99);

  let riskLevel = 'Low';
  if (confidence >= 86) {
    riskLevel = 'Critical';
  } else if (confidence >= 71) {
    riskLevel = 'High';
  } else if (confidence >= 51) {
    riskLevel = 'Moderate';
  } else if (confidence >= 31) {
    riskLevel = 'Caution';
  }

  res.json({ confidence, riskLevel });
});

export default router;
