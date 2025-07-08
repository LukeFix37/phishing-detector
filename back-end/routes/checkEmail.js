// Enhanced phishing detection for emails

const router = express.Router();

router.post('/', (req, res) => {
const { emailText } = req.body;
if (!emailText) return res.status(400).json({ error: 'Email text is required' });
const emailLower = emailText.toLowerCase();
let riskScore = 0;
let maxScore = 0;

// 1. High-risk phishing phrases with weighted scores

const highRiskPhrases = [
{ phrase: 'verify your account', weight: 15 },
{ phrase: 'account suspended', weight: 18 },
{ phrase: 'urgent action required', weight: 16 },
{ phrase: 'confirm your password', weight: 17 },
{ phrase: 'security alert', weight: 14 },
{ phrase: 'click here to verify', weight: 19 },
{ phrase: 'account will be closed', weight: 18 },
{ phrase: 'immediate attention required', weight: 17 },
{ phrase: 'unusual activity detected', weight: 16 },
{ phrase: 'temporary hold', weight: 15 },
{ phrase: 'reactivate your account', weight: 16 },
{ phrase: 'confirm your identity', weight: 15 },
{ phrase: 'update payment information', weight: 17 },
{ phrase: 'act now', weight: 12 },
{ phrase: 'limited time offer', weight: 10 },
{ phrase: 'click below to verify', weight: 18 }
];
maxScore += 20; // Max points for phrases
highRiskPhrases.forEach(({ phrase, weight }) => {
if (emailLower.includes(phrase)) {
riskScore += weight;
return; // Only count the first match to avoid double scoring
}
});

// 2. Urgency and pressure words

const urgencyWords = [
{ word: 'immediately', weight: 3 },
{ word: 'urgent', weight: 3 },
{ word: 'asap', weight: 3 },
{ word: 'now', weight: 2 },
{ word: 'quickly', weight: 2 },
{ word: 'expires', weight: 4 },
{ word: 'deadline', weight: 3 },
{ word: 'emergency', weight: 4 },
{ word: 'critical', weight: 3 },
{ word: 'final notice', weight: 5 }
];
maxScore += 15; // Max points for urgency
let urgencyScore = 0;
urgencyWords.forEach(({ word, weight }) => {
const matches = (emailLower.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
if (matches > 0) {
urgencyScore += weight * Math.min(matches, 2); // Cap at 2 occurrences
}
});
riskScore += Math.min(urgencyScore, 15);

// 3. Suspicious sender patterns

maxScore += 15; // Max points for sender analysis
const emailMatch = emailText.match(/from[:\s]+([^\n\r<>]+)/i);
const senderInfo = emailMatch ? emailMatch[1].toLowerCase() : '';
const suspiciousSenderPatterns = [
/no-?reply/,
/support@[a-z0-9-]+.(tk|ml|ga|cf)/,
/[0-9]{4,}@/,
/admin@[a-z0-9-]+.(tk|ml|ga|cf|xyz)/,
/security@[a-z0-9-]+.(tk|ml|ga|cf)/,
/[a-z]{1,3}[0-9]{3,}@/,
/[0-9]+[a-z]+[0-9]+@/
];
let senderRisk = 0;
if (senderInfo) {
suspiciousSenderPatterns.forEach(pattern => {
if (pattern.test(senderInfo)) {
senderRisk += 5;
}
});
}
riskScore += Math.min(senderRisk, 15);

// 4. URL analysis within email

const urlRegex = /https?:\/\/[^\s<>"]+/gi;
const urls = emailText.match(urlRegex) || [];
maxScore += 20; // Max points for URL analysis
let urlRisk = 0;
if (urls.length > 0) {
urls.forEach(url => {
const urlLower = url.toLowerCase();
  // Suspicious URL patterns
  if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(url)) {
    urlRisk += 8; // IP address instead of domain
  }
  
  if (/(bit\.ly|tinyurl|t\.co|short|tiny|url)/.test(urlLower)) {
    urlRisk += 5; // URL shorteners
  }
  
  if (/[a-z0-9-]+\.(tk|ml|ga|cf|xyz)/.test(urlLower)) {
    urlRisk += 6; // Suspicious TLDs
  }
  
  if ((urlLower.match(/-/g) || []).length > 3) {
    urlRisk += 3; // Too many hyphens
  }
  
  if (/[0-9]{4,}/.test(urlLower)) {
    urlRisk += 3; // Long number sequences
  }
});

// Multiple URLs increase risk
if (urls.length > 3) {
  urlRisk += 4;
}
}
riskScore += Math.min(urlRisk, 20);

// 5. Grammar and spelling analysis (simple)

maxScore += 10; // Max points for grammar
let grammarIssues = 0;
// Common grammar mistakes in phishing emails
const grammarPatterns = [
/\b(recieve|loose|there account|you're account|wont|cant)\b/i,
/[.!?]\s*[a-z]/g, // Lowercase after punctuation
/\s{2,}/g, // Multiple spaces
/[A-Z]{4,}/g // Excessive caps
];
grammarPatterns.forEach(pattern => {
const matches = (emailText.match(pattern) || []).length;
grammarIssues += matches;
});
riskScore += Math.min(grammarIssues * 2, 10);

// 6. Request for sensitive information

maxScore += 10; // Max points for sensitive info requests
const sensitiveRequests = [
'social security', 'ssn', 'credit card', 'bank account',
'routing number', 'pin number', 'password', 'personal information',
'date of birth', 'mother maiden name', 'tax id'
];
let sensitiveScore = 0;
sensitiveRequests.forEach(request => {
if (emailLower.includes(request)) {
sensitiveScore += 3;
}
});
riskScore += Math.min(sensitiveScore, 10);

// 7. Legitimate indicators (reduce risk)

const legitimateIndicators = [
/unsubscribe/i,
/privacy policy/i,
/terms of service/i,
/physical address.*[0-9]+.street/i,
/customer service.[0-9]{3}[.-][0-9]{3}[.-][0-9]{4}/i
];
let legitimacyBonus = 0;
legitimateIndicators.forEach(indicator => {
if (indicator.test(emailText)) {
legitimacyBonus += 3;
}
});
riskScore = Math.max(0, riskScore - legitimacyBonus);

// Calculate final confidence percentage

const rawConfidence = Math.min((riskScore / maxScore) * 100, 95);
const confidence = Math.round(rawConfidence);

// Determine risk level based on confidence

let riskLevel = 'Low';
let description = 'No major phishing indicators detected.';
if (confidence >= 85) {
riskLevel = 'Critical';
description = 'Severe risk — highly likely phishing email.';
} else if (confidence >= 70) {
riskLevel = 'High';
description = 'High probability phishing; action recommended.';
} else if (confidence >= 50) {
riskLevel = 'Moderate';
description = 'Strong phishing signals; treat with suspicion.';
} else if (confidence >= 30) {
riskLevel = 'Caution';
description = 'Possible phishing features; recommend checking.';
}

// Add debugging info in development

const debugInfo = process.env.NODE_ENV === 'development' ? {
totalRiskScore: riskScore,
maxPossibleScore: maxScore,
urlsFound: urls.length,
analysisBreakdown: {
phishingPhrases: Math.min(urgencyScore, 15),
senderAnalysis: Math.min(senderRisk, 15),
urlAnalysis: Math.min(urlRisk, 20),
grammarIssues: Math.min(grammarIssues * 2, 10),
sensitiveRequests: Math.min(sensitiveScore, 10),
legitimacyBonus: legitimacyBonus
}
} : undefined;
res.json({
confidence,
riskLevel,
description,
isPhishing: confidence >= 50,
...(debugInfo && { debug: debugInfo })
});
});
export default router;