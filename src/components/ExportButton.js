// ExportButton.js

import React from "react";
// import { jsPDF } from "jspdf";
import "../css/ExportButton.css";

function ExportButton(props) {
  // const buildPDF = () => {
  //   const canvas = document.getElementById("hiddenCanvas");
  //   console.log(`building PDF...`);
  //   const doc = new jsPDF({
  //     unit: "in",
  //     format: [8.5, 11],
  //   });
  //   doc.text("HELLO WORLD!", 1, 1);
  //   doc.addImage(canvas, "PNG", 1, 2, 6, 4, "cat", "NONE", 0);
  //   doc.save("testCat.pdf");
  // };

  return (
    <div className="exportButtonWrapper">
      <div className="exportButton" onClick={props.makePDF}>
        make pdf
      </div>
    </div>
  );
}

export default ExportButton;
