// Preview.js

import React from "react";

import "../css/Preview.css";

class Preview extends React.Component {
  componentDidMount() {
    // console.log(`canvas mounted!`);
    // this.props.connectCanvas(document.getElementById("hiddenCanvas"), "hidden");
    // this.props.connectCanvas(
    //   document.getElementById("previewCanvas"),
    //   "preview"
    // );
    this.drawHidden();
    this.drawPreview();
  }

  componentDidUpdate(prevProps) {
    // Redraw the canvases if the image has changed or the
    // viewport size has changed.
    if (
      prevProps.app.saveStack.length !== this.props.app.saveStack.length ||
      prevProps.app.viewportWidth !== this.props.app.viewportWidth
    ) {
      this.drawHidden();
      this.drawPreview();
    }
  }

  drawHidden() {
    // console.log('drawHidden called.')
    // console.log(this.props.app.currentPixels);
    // console.log(`width: ${this.props.app.currentPixels.width}`);
    // console.log(`height: ${this.props.app.currentPixels.height}`);
    const hiddenCanvas = document.getElementById("hiddenCanvas");
    const hiddenCTX = hiddenCanvas.getContext("2d");
    // hiddenCanvas.width = this.props.app.currentPixels.width;
    // hiddenCanvas.height = this.props.app.currentPixels.height;
    // hiddenCTX.setTransform(2, 0, 0, 2, 0, 0);
    hiddenCTX.putImageData(this.props.app.currentPixels, 0, 0);
    // hiddenCTX.drawImage(this.props.app.originalImage, 0, 0);
  }

  drawPreview() {
    const hiddenCanvas = document.getElementById("hiddenCanvas");
    const previewCanvas = document.getElementById("previewCanvas");
    previewCanvas.width = this.props.app.previewWidth;
    previewCanvas.height = this.props.app.previewHeight;
    const scaleFactor = previewCanvas.width / this.props.app.currentPixels.width;
    const previewCTX = previewCanvas.getContext("2d");
    previewCTX.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
    // previewCTX.putImageData(this.props.app.currentPixels, 0, 0);
    previewCTX.drawImage(document.getElementById("hiddenCanvas"), 0, 0);
  }

  render() {
    return (
      <div className="Preview">
        {/* {this.props.app.hiddenCanvas} */}
        <canvas
          id="hiddenCanvas"
          width={this.props.app.currentPixels.width}
          height={this.props.app.currentPixels.height}
        ></canvas>
        <canvas
          id="previewCanvas"
          width={this.props.app.previewWidth}
          height={this.props.app.previewHeight}
        >
          preview image here
        </canvas>
      </div>
    );
  }
}

export default Preview;
