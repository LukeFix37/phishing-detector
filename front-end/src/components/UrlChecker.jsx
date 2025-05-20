import { useState } from "react";
// Axios library for making HTTP requests
import axios from "axios";
// Importing global styles
import "../styles.css";

function UrlChecker() {
  // State to store the URL input by the user
  const [url, setUrl] = useState("");
  // State to store the result returned from the phishing detection API
  const [result, setResult] = useState(null);

  // Function to handle the URL phishing check when user clicks the button
  const handleCheck = async () => {
    try {
      // Send POST request to the phishing detector API with the URL to be checked
      const response = await axios.post("https://phishing-detector-u0on.onrender.com/check-url", {
        url,
      });
      // Update the result state with the response data
      setResult(response.data);
    } catch (error) {
      // Log any errors and reset result to null if request fails
      console.error("Error checking URL:", error);
      setResult(null);
    }
  };

  // Helper function to return a descriptive message based on the risk level
  const getRiskDescription = (riskLevel) => {
    switch (riskLevel) {
      case "Critical":
        return "Severe risk — highly likely phishing URL.";
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

  // Helper function to return a color code associated with each risk level
  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case "Critical":
        return "#8b0000"; // dark red
      case "High":
        return "#b22222"; // firebrick red
      case "Moderate":
        return "#ff8c00"; // dark orange
      case "Caution":
        return "#daa520"; // goldenrod
      case "Low":
        return "#006400"; // dark green
      default:
        return "#333"; // default gray color
    }
  };

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      {/* Title of the phishing detector */}
      <h1>URL Phishing Detector</h1>

      {/* Text input field for user to paste the URL */}
      <input
        type="text"
        className="border p-3 w-full mb-4 rounded-md text-base bg-[#1e293b] text-[#e0e6f0] shadow-inner focus:bg-[#2c3e50] outline-none"
        value={url}
        onChange={(e) => setUrl(e.target.value)} // Update state on input change
        placeholder="Paste URL here"
      />

      {/* Button to trigger the phishing check */}
      <button onClick={handleCheck}>Check</button>

      {/* Conditional rendering of the result block if a result is available */}
      {result && (
        <div
          className="result mt-4"
          style={{
            backgroundColor: getRiskColor(result.riskLevel), // background based on risk level
            padding: "1rem",
            borderRadius: "6px",
            color: "#fff",
            marginTop: "1rem",
          }}
        >
          {/* Display confidence percentage returned by the API */}
          <p>
            <strong>Confidence:</strong> {result.confidence}%
          </p>
          {/* Display risk level label */}
          <p>
            <strong>Risk Level:</strong> {result.riskLevel}
          </p>
          {/* Display detailed risk description */}
          <p>{getRiskDescription(result.riskLevel)}</p>
        </div>
      )}
    </div>
  );
}

export default UrlChecker;
