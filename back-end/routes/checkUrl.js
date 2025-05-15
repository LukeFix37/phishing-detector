import express from 'express';
const router = express.Router();

router.post('/', (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });

  const phishingKeywords = ['login', 'secure', 'update', 'verify', 'account'];
  const urlLower = url.toLowerCase();

  const containsPhishingKeyword = phishingKeywords.some(keyword => urlLower.includes(keyword));

  const confidence = containsPhishingKeyword
    ? Math.floor(Math.random() * 21) + 80  // 80-100%
    : Math.floor(Math.random() * 31) + 50 // 50-80%

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

  res.json({
    url,
    confidence,
    riskLevel
  });
});

export default router;
