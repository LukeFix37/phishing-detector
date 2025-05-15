import React from "react";
import "./ConfidenceTable.css";

const ConfidenceTable = () => (
  <div className="confidence-table-container">
    <h2>Confidence Score Table</h2>
    <table>
      <thead>
        <tr>
          <th>Confidence Score Range</th>
          <th>Phishing Detection Quality</th>
          <th>Interpretation</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>0% – 30%</td>
          <td>Low confidence</td>
          <td>Likely not phishing (safe)</td>
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

export default ConfidenceTable;
