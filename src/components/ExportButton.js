// ExportButton.js

import React from "react";
import { jsPDF } from "jspdf";
import "../css/ExportButton.css";

function ExportButton() {
  const buildPDF = () => {
    console.log(`building PDF...`);
    const doc = new jsPDF();
    doc.text("HELLO WORLD!", 10, 10);
    doc.save("a4.pdf");
  };

  return (
    <div className="exportButtonWrapper">
      <div className="exportButton" onClick={buildPDF}>
        make pdf
      </div>
      <iframe id="testPDF" src="" title="testPDF">
        testPDFlink?
      </iframe>
    </div>
  );
}

export default ExportButton;
