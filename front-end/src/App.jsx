import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// Import the main components for URL and Email phishing checks
import UrlChecker from "./components/UrlChecker";
import EmailChecker from "./components/EmailChecker";
import ConfidenceTable from "./components/ConfidenceTable";
// Import Vercel analytics for usage tracking
import { Analytics } from "@vercel/analytics/react";
import "./styles.css";
import { useEffect } from "react";

function App() {
  // Sample data passed to ConfidenceTable as example props (not currently used inside ConfidenceTable)
  const sampleData = [
    { label: "Phishing", confidence: 80 },
    { label: "Safe", confidence: 20 },
  ];

  // useEffect to periodically ping backend to keep it awake (e.g., for serverless platforms that sleep)
  useEffect(() => {
    // Function to send a GET request to the backend /ping endpoint
    const pingBackend = () => {
      fetch("https://phishing-detector-u0on.onrender.com/ping")
        .then((res) => console.log("Backend awake:", res.status))
        .catch((err) => console.error("Ping failed:", err));
    };

    // Ping once immediately on app load
    pingBackend();

    // Set interval to ping backend every 5 minutes (5 * 60 * 1000 ms)
    const interval = setInterval(pingBackend, 5 * 60 * 1000);

    // Cleanup the interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <div>
        {/* Header section with navigation links */}
        <header style={{ marginBottom: "2rem", textAlign: "center" }}>
          <nav
            style={{ display: "flex", justifyContent: "center", gap: "2rem" }}
          >
            {/* Link to the URL Checker page */}
            <Link
              to="/"
              style={{
                color: "#00d8ff",
                fontWeight: "700",
                textDecoration: "none",
                fontSize: "1.1rem",
              }}
            >
              URL Checker
            </Link>

            {/* Link to the Email Checker page */}
            <Link
              to="/email"
              style={{
                color: "#00d8ff",
                fontWeight: "700",
                textDecoration: "none",
                fontSize: "1.1rem",
              }}
            >
              Email Checker
            </Link>
          </nav>
        </header>

        {/* Main content area */}
        <div className="main-content">
          <div className="container">
            {/* Define routes for the app */}
            <Routes>
              {/* Default route loads UrlChecker component */}
              <Route path="/" element={<UrlChecker />} />
              {/* /email route loads EmailChecker component */}
              <Route path="/email" element={<EmailChecker />} />
            </Routes>
          </div>

          {/* Section displaying the Confidence Score Table */}
          <div className="table-container">
            {/* ConfidenceTable component shown with sampleData (though the component doesn't use props currently) */}
            <ConfidenceTable data={sampleData} />
          </div>
        </div>

        {/* Vercel Analytics tracking component */}
        <Analytics />
      </div>
    </BrowserRouter>
  );
}

export default App;
