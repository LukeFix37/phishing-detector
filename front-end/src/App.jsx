import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UrlChecker from "./components/UrlChecker";
import EmailChecker from "./components/EmailChecker";
import ConfidenceTable from "./components/ConfidenceTable";
import "./styles.css"; 

function App() {
  const sampleData = [
    { label: "Phishing", confidence: 80 },
    { label: "Safe", confidence: 20 },
  ];

  return (
    <BrowserRouter>
      <div>
        <header style={{ marginBottom: "2rem", textAlign: "center" }}>
          <nav
            style={{ display: "flex", justifyContent: "center", gap: "2rem" }}
          >
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

        <div className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<UrlChecker />} />
              <Route path="/email" element={<EmailChecker />} />
            </Routes>
          </div>

          <div className="table-container">
            <ConfidenceTable data={sampleData} />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
