// SizeAndPaper.js

import React from "react";

import "../css/SizeAndPaper.css";

class SizeAndPaper extends React.Component {
  handlePaperChange(event) {
    this.props.updatePaperSize(event.target.value);
  }

  render() {
    return (
      <div className="sizeAndPaper">
        <div>
          <div className="sizeBlurb">
            Your original image is {this.props.app.originalImage.width} pixels
            wide by {this.props.app.originalImage.height} pixels high. Printed
            at 150dpi (dots per inch), your original image would print to a size of{" "}
            {(this.props.app.originalImage.width / 150).toFixed(2)}" x{" "}
            {(this.props.app.originalImage.height / 150).toFixed(2)}".
          </div>
          <div>
            printer paper size:&nbsp;
            <select
              value={this.props.app.paperSize}
              onChange={this.props.updatePaperSize}
            >
              <option value="8.5x11">Letter - 8.5" x 11"</option>
              <option value="8.5x14">Legal - 8.5" x 14"</option>
              <option value="11x17">Tabloid - 11" x 17"</option>
              <option value="A4">A4 - 8.3" x 11.7"</option>
            </select>
          </div>
          xpld'd img size:
          <br />
          <div className="imgSizeInput">
            units:&nbsp;&nbsp;&nbsp;
            <select
              id="units"
              value={this.props.app.posterUnits}
              onChange={this.props.updatePosterUnits}
            >
              <option value="inches">inches</option>
              <option value="cm">cm</option>
            </select>
            <br />
            <div className="widthHeightInputs">
              <div className="innerWidthHeight">
                <div>width:</div>
                <div>
                  <input
                    type="text"
                    value={this.props.app.posterWidth}
                    onChange={this.props.updatePosterWidth}
                  />
                </div>
              </div>
              &nbsp;{this.props.app.posterUnits}
            </div>
            <div className="widthHeightInputs">
              <div className="innerWidthHeight">
                <div>height:</div>
                <div>
                  <input
                    type="text"
                    value={this.props.app.posterHeight}
                    onChange={this.props.updatePosterHeight}
                  />
                </div>
              </div>
              &nbsp;{this.props.app.posterUnits}
            </div>
          </div>
        </div>
        <div className="exportButton" onClick={this.props.makePDF}>
          make pdf
        </div>
        {/* <div id="applyButton" onClick={this.props.fitToPoster}>
          apply
        </div> */}
      </div>
    );
  }
}

export default SizeAndPaper;
