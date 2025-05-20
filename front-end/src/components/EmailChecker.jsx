// Import React's useState hook to manage component state
import { useState } from "react";
// Import axios library for making HTTP requests
import axios from "axios";
// Import CSS styles for the component
import "../styles.css";

// Functional React component for checking email phishing risk
function EmailChecker() {
  // State to store the text input from the user (email content)
  const [emailText, setEmailText] = useState("");
  // State to store the result returned from the phishing check API
  const [result, setResult] = useState(null);

  // Async function to send the email text to the phishing detection API
  const handleCheck = async () => {
    try {
      // Send POST request to API with emailText as payload
      const response = await axios.post("https://phishing-detector-u0on.onrender.com/check-email", {
        emailText,
      });
      // Update result state with the response data from the API
      setResult(response.data);
    } catch (error) {
      // Log any error that occurs during the API request
      console.error("Error checking email:", error);
      // Reset result state to null in case of error
      setResult(null);
    }
  };

  // Helper function to return a descriptive message based on the risk level
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

  // Helper function to return a color code representing the risk level severity
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "Critical":
        return "#8b0000";  // Dark Red
      case "High":
        return "#b22222";  // Firebrick Red
      case "Moderate":
        return "#ff8c00";  // Dark Orange
      case "Caution":
        return "#daa520";  // Goldenrod
      case "Low":
        return "#006400";  // Dark Green
      default:
        return "#333";     // Default dark gray color
    }
  };

  return (
    // Container div to center the content with max width for readability
    <div className="container" style={{ maxWidth: "600px" }}>
      <h1>Email Phishing Detector</h1>

      {/* Textarea for user to paste email content */}
      <textarea
        className="border p-3 w-full h-32 mb-4 rounded-md text-base bg-[#1e293b] text-[#e0e6f0] shadow-inner focus:bg-[#2c3e50] outline-none"
        value={emailText}  // Controlled component bound to emailText state
        onChange={(e) => setEmailText(e.target.value)}  // Update state on input change
        placeholder="Paste email text here"
      />

      {/* Button to trigger phishing check */}
      <button onClick={handleCheck}>Check</button>

      {/* Conditionally render the result only if it exists */}
      {result && (
        <div
          className="result mt-4"
          style={{
            backgroundColor: getRiskColor(result.riskLevel),  // Background color based on risk level
            padding: "1rem",
            borderRadius: "6px",
            color: "#fff",
            marginTop: "1rem",
          }}
        >
          {/* Display the confidence percentage of the prediction */}
          <p>
            <strong>Confidence:</strong> {result.confidence}%
          </p>

          {/* Display the risk level label */}
          <p>
            <strong>Risk Level:</strong> {result.riskLevel}
          </p>

          {/* Display a detailed description for the risk level */}
          <p>{getRiskDescription(result.riskLevel)}</p>
        </div>
      )}
    </div>
  );
}

// Export the component as default export to be used elsewhere
export default EmailChecker;
