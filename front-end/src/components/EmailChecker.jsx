import { useState } from "react";
import axios from "axios";
import "../styles.css";

function EmailChecker() {
  const [emailText, setEmailText] = useState("");
  const [result, setResult] = useState(null);

  const handleCheck = async () => {
    try {
      const response = await axios.post("https://phishing-detector-u0on.onrender.com/check-email", {
        emailText,
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error checking email:", error);
      setResult(null);
    }
  };

  const getRiskDescription = (riskLevel) => {
    switch (riskLevel) {
      case "Critical":
        return "Severe risk — highly likely phishing email.";
      case "High":
        return "High probability phishing; action recommended.";
      case "Moderate":
        return "Strong phishing signals; treat with suspicion.";
      case "Caution":
        return "Possible phishing features; recommend checking.";
      case "Low":
        return "No major phishing indicators detected.";
      default:
        return "";
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "Critical":
        return "#8b0000";
      case "High":
        return "#b22222";
      case "Moderate":
        return "#ff8c00";
      case "Caution":
        return "#daa520";
      case "Low":
        return "#006400";
      default:
        return "#333";
    }
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <h1>Email Phishing Detector</h1>
      <textarea
        className="border p-3 w-full h-32 mb-4 rounded-md text-base bg-[#1e293b] text-[#e0e6f0] shadow-inner focus:bg-[#2c3e50] outline-none"
        value={emailText}
        onChange={(e) => setEmailText(e.target.value)}
        placeholder="Paste email text here"
      />
      <button onClick={handleCheck}>Check</button>

      {result && (
        <div
          className="result mt-4"
          style={{
            backgroundColor: getRiskColor(result.riskLevel),
            padding: "1rem",
            borderRadius: "6px",
            color: "#fff",
            marginTop: "1rem",
          }}
        >
          <p>
            <strong>Confidence:</strong> {result.confidence}%
          </p>
          <p>
            <strong>Risk Level:</strong> {result.riskLevel}
          </p>
          <p>{getRiskDescription(result.riskLevel)}</p>
        </div>
      )}
    </div>
  );
}

export default EmailChecker;
