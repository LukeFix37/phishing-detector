# Phishing Detection API & Frontend

This project provides a phishing detection tool for emails and URLs. It analyzes input text or URLs and returns a phishing risk assessment based on confidence scores. The project includes backend APIs (Node.js/Express) and React frontend components.

---

## Features

- **Email Phishing Detection**  
  Analyzes email text for phishing indicators using keyword likelihood ratios, urgency words, and URLs.

- **URL Phishing Detection**  
  Evaluates URLs based on suspicious keywords and assigns a phishing risk level.

- **Risk Level Classification**  
  Confidence scores are mapped to risk levels from Low to Critical, with detailed descriptions.

---

## Confidence Score Chart

| Confidence Score (%) | Risk Level | Description                                     |
| :------------------- | :--------- | :---------------------------------------------- |
| 0–30                 | Low        | No major phishing indicators detected.          |
| 31–50                | Caution    | Possible phishing features; recommend checking. |
| 51–70                | Moderate   | Strong phishing signals; treat with suspicion.  |
| 71–85                | High       | High probability phishing; action recommended.  |
| 86–100               | Critical   | Severe risk — highly likely phishing URL.       |

---

## Backend

### Technologies
- Node.js
- Express

### Endpoints

- **POST /check-email**  
  Request body: `{ emailText: string }`  
  Response: `{ isPhishing: boolean, confidence: number, riskLevel: string, description: string }`

- **POST /check-url**  
  Request body: `{ url: string }`  
  Response: `{ url: string, isPhishing: boolean, confidence: number, riskLevel: string, description: string }`

### Running the Server
```bash
npm install
npm start
