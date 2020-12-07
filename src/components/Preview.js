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
    // this.drawDebug();
    this.drawHidden();
    this.drawPreview();
  }

  componentDidUpdate(prevProps) {
    // Redraw the canvases if the image has changed or the
    // viewport size has changed, or showProcessing has changed.
    if (this.props.app.redrawFlag === true) {
      // console.log(prevProps.app.showProcessing, this.props.app.showProcessing);
      // this.drawDebug();
      this.drawHidden();
      this.drawPreview();
    }
  }

  drawDebug() {
    const debugCanvas = document.getElementById("debugCanvas");
    debugCanvas.width = this.props.app.debugCanvas.width;
    debugCanvas.height = this.props.app.debugCanvas.height;
    const debugCTX = debugCanvas.getContext("2d");
    debugCTX.drawImage(this.props.app.debugCanvas, 0, 0);
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
    if (this.props.app.pdfCanvas !== undefined) {
      console.log(`should display poster preview...`);
      hiddenCanvas.width = this.props.app.pdfCanvas.width;
      hiddenCanvas.height = this.props.app.pdfCanvas.height;
      hiddenCTX.drawImage(this.props.app.pdfCanvas, 0, 0);
    } else {
      // hiddenCTX.putImageData(this.props.app.currentPixels, 0, 0);
      hiddenCTX.drawImage(this.props.app.currentCanvas, 0, 0);
    }
  }

  drawPreview() {
    const previewCanvas = document.getElementById("previewCanvas");
    previewCanvas.width = this.props.app.previewWidth;
    previewCanvas.height = this.props.app.previewHeight;
    const previewCTX = previewCanvas.getContext("2d");
    previewCTX.drawImage(
      this.props.app.currentCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height
    );
    // const scaleFactor =
    //   previewCanvas.width / this.props.app.currentPixels.width;
    // previewCTX.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
    // // previewCTX.putImageData(this.props.app.currentPixels, 0, 0);
    // previewCTX.drawImage(this.props.app.currentCanvas, 0, 0);
    // // if(this.props.app.showProcessing) {
    // //   console.log(`got here to show processing.`)
    // //   const img = <img src={favicon} alt="processing"/>
    // //   previewCTX.drawImage(img, 0, 0);
    // // }
  }

  render() {
    return (
      <div className="Preview">
        {/* {this.props.app.hiddenCanvas} */}
        <canvas
          id="hiddenCanvas"
          width="800"
          height="800"
          // width={this.props.app.currentPixels.width}
          // height={this.props.app.currentPixels.height}
        ></canvas>
        <canvas
          id="previewCanvas"
          width={this.props.app.previewWidth}
          height={this.props.app.previewHeight}
        >
          preview image here
        </canvas>
        {/* <canvas 
        id="debugCanvas"
        width={this.props.app.debugCanvas.width}
        height={this.props.app.debugCanvas.height} >
          debug canvas here
        </canvas> */}
      </div>
    );
  }
}

export default Preview;
