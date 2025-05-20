import React from "react";
// Import the CSS file for styling the confidence table
import "./ConfidenceTable.css";

// Functional React component that renders a table explaining confidence score ranges
const ConfidenceTable = () => (
  // Container div for the confidence table, styled with a CSS class
  <div className="confidence-table-container">
    {/* Heading for the confidence score table */}
    <h2>Confidence Score Table</h2>

    {/* Table element displaying confidence score ranges and their meanings */}
    <table>
      {/* Table header defining columns */}
      <thead>
        <tr>
          <th>Confidence Score Range</th> {/* Range of confidence percentage */}
          <th>Phishing Detection Quality</th> {/* Label describing confidence level */}
          <th>Interpretation</th> {/* Explanation of what the confidence level implies */}
        </tr>
      </thead>

      {/* Table body with rows for each confidence score range */}
      <tbody>
        <tr>
          <td>0% – 30%</td> {/* Confidence score range */}
          <td>Low confidence</td> {/* Detection quality */}
          <td>Likely not phishing (safe)</td> {/* Interpretation */}
        </tr>
        <tr>
          <td>31% – 50%</td>
          <td>Caution</td>
          <td>Uncertain; may require further check</td>
        </tr>
        <tr>
          <td>51% – 70%</td>
          <td>Moderate</td>
          <td>Strong phishing signals; treat with suspicion</td>
        </tr>
        <tr>
          <td>71% – 85%</td>
          <td>High</td>
          <td>Very likely phishing (strong alert)</td>
        </tr>
        <tr>
          <td>86% - 100%</td>
          <td>Critical</td>
          <td>Severe risk; highly likely phishing</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Export the ConfidenceTable component as default for use in other parts of the app
export default ConfidenceTable;
