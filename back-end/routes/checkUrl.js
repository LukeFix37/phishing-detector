// Enhanced phishing detection for URLs
router.post('/', (req, res) => {
const { url } = req.body;
if (!url) return res.status(400).json({ error: 'URL is required' });
let riskScore = 0;
let maxScore = 0;
const urlLower = url.toLowerCase();
try {
const urlObj = new URL(url);
const domain = urlObj.hostname;
const path = urlObj.pathname;
const params = urlObj.searchParams;
// 1. Domain analysis
maxScore += 25; // Max points for domain analysis
let domainRisk = 0;

// Suspicious TLDs
const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.xyz', '.click', '.download', '.review', '.country', '.stream'];
if (suspiciousTlds.some(tld => domain.endsWith(tld))) {
  domainRisk += 8;
}

// IP address instead of domain name
if (/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(domain)) {
  domainRisk += 12;
}

// Long domain or subdomain abuse
if (domain.length > 30) {
  domainRisk += 4;
}

// Multiple subdomains (subdomain abuse)
const subdomainCount = (domain.match(/\./g) || []).length;
if (subdomainCount > 3) {
  domainRisk += 5;
}

// Domain with many hyphens
const hyphenCount = (domain.match(/-/g) || []).length;
if (hyphenCount > 3) {
  domainRisk += 3;
}

// Numbers in domain (suspicious pattern)
if (/[0-9]{3,}/.test(domain)) {
  domainRisk += 4;
}

riskScore += Math.min(domainRisk, 25);

// 2. URL structure analysis
maxScore += 20; // Max points for URL structure
let structureRisk = 0;

// Extremely long URLs
if (url.length > 200) {
  structureRisk += 5;
} else if (url.length > 100) {
  structureRisk += 3;
}

// Too many parameters
if (params.toString().length > 100) {
  structureRisk += 4;
}

// Suspicious path patterns
const suspiciousPathPatterns = [
  /\/wp-admin/,
  /\/admin/,
  /\/login\.php/,
  /\/secure/,
  /\/update/,
  /\/verify/,
  /\/account/,
  /\/billing/,
  /\/suspended/
];

suspiciousPathPatterns.forEach(pattern => {
  if (pattern.test(path)) {
    structureRisk += 3;
  }
});

riskScore += Math.min(structureRisk, 20);

// 3. Phishing keyword analysis
maxScore += 20; // Max points for keywords
let keywordRisk = 0;

const phishingKeywords = [
  { keyword: 'login', weight: 3 },
  { keyword: 'secure', weight: 3 },
  { keyword: 'update', weight: 4 },
  { keyword: 'verify', weight: 4 },
  { keyword: 'account', weight: 3 },
  { keyword: 'banking', weight: 5 },
  { keyword: 'paypal', weight: 4 },
  { keyword: 'amazon', weight: 4 },
  { keyword: 'microsoft', weight: 4 },
  { keyword: 'apple', weight: 4 },
  { keyword: 'security', weight: 3 },
  { keyword: 'suspended', weight: 5 },
  { keyword: 'confirm', weight: 4 },
  { keyword: 'urgent', weight: 4 },
  { keyword: 'expired', weight: 4 }
];

phishingKeywords.forEach(({ keyword, weight }) => {
  if (urlLower.includes(keyword)) {
    keywordRisk += weight;
  }
});

riskScore += Math.min(keywordRisk, 20);

// 4. Brand impersonation detection
maxScore += 15; // Max points for brand impersonation
let brandRisk = 0;

const popularBrands = [
  'paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook', 
  'instagram', 'twitter', 'linkedin', 'netflix', 'spotify', 
  'dropbox', 'adobe', 'salesforce', 'zoom'
];

popularBrands.forEach(brand => {
  if (urlLower.includes(brand) && !domain.includes(brand + '.com') && !domain.endsWith('.' + brand + '.com')) {
    brandRisk += 8; // Brand name in URL but not official domain
  }
});

riskScore += Math.min(brandRisk, 15);

// 5. Protocol and security analysis
maxScore += 10; // Max points for protocol
let protocolRisk = 0;

// HTTP instead of HTTPS for sensitive operations
if (urlObj.protocol === 'http:' && (urlLower.includes('login') || urlLower.includes('secure') || urlLower.includes('bank'))) {
  protocolRisk += 6;
}

// Non-standard ports
if (urlObj.port && !['80', '443', '8080', '8443'].includes(urlObj.port)) {
  protocolRisk += 4;
}

riskScore += Math.min(protocolRisk, 10);

// 6. URL shortener detection
maxScore += 10; // Max points for URL shorteners
const urlShorteners = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link',
  'tiny.cc', 'lnkd.in', 'buff.ly', 'rebrand.ly', 'cutt.ly'
];

let shortenerRisk = 0;
if (urlShorteners.some(shortener => domain.includes(shortener))) {
  shortenerRisk = 10; // High risk for shortened URLs
}

riskScore += shortenerRisk;

// 7. Legitimate indicators (reduce risk)
const legitimateIndicators = [
  // Well-known legitimate domains
  domain.endsWith('.edu'),
  domain.endsWith('.gov'),
  domain.endsWith('.org') && domain.split('.').length === 2,
  // HTTPS with common legitimate patterns
  urlObj.protocol === 'https:' && domain.split('.').length === 2,
  // Common legitimate subdomains
  domain.startsWith('www.') || domain.startsWith('support.') || domain.startsWith('help.')
];

let legitimacyBonus = 0;
legitimateIndicators.forEach(indicator => {
  if (indicator) {
    legitimacyBonus += 2;
  }
});

riskScore = Math.max(0, riskScore - legitimacyBonus);
} catch (error) {
// Invalid URL format
riskScore += 20;
maxScore += 20;
}
// Calculate final confidence percentage
const rawConfidence = Math.min((riskScore / maxScore) * 100, 95);
const confidence = Math.round(rawConfidence);
// Determine risk level based on confidence
let riskLevel = 'Low';
let description = 'No major phishing indicators detected.';
if (confidence >= 85) {
riskLevel = 'Critical';
description = 'Severe risk — highly likely phishing URL.';
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
domain: url.includes('://') ? new URL(url).hostname : 'Invalid URL',
analysisBreakdown: {
domainAnalysis: Math.min(riskScore, 25),
urlStructure: 'calculated',
phishingKeywords: 'calculated',
brandImpersonation: 'calculated',
protocolSecurity: 'calculated'
}
} : undefined;
res.json({
url,
confidence,
riskLevel,
description,
isPhishing: confidence >= 50,
...(debugInfo && { debug: debugInfo })
});
});
export default router;