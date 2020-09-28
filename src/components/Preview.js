// Preview.js

import React from "react";

import "../css/Preview.css";

class Preview extends React.Component {
  componentDidMount() {
    // console.log(`canvas mounted!`);
    this.props.connectCanvas(document.getElementById("hiddenCanvas"), "hidden");
    this.props.connectCanvas(
      document.getElementById("previewCanvas"),
      "preview"
    );
    this.props.drawHidden();
    this.props.drawPreview();
  }

  componentDidUpdate(prevProps) {
    // Redraw the canvases if the image has changed or the
    // viewport size has changed.
    if (
      prevProps.app.currentImage !== this.props.app.currentImage ||
      prevProps.app.viewportWidth !== this.props.app.viewportWidth
    ) {
      this.props.drawHidden();
      this.props.drawPreview();
    }
  }

  render() {
    return (
      <div className="Preview">
        {/* {this.props.app.hiddenCanvas} */}
        <canvas
          id="hiddenCanvas"
          width={this.props.app.hiddenCanvasSize.w}
          height={this.props.app.hiddenCanvasSize.h}
        ></canvas>
        <canvas
          id="previewCanvas"
          width={this.props.app.previewCanvasSize.w}
          height={this.props.app.previewCanvasSize.h}
        >
          preview image here
        </canvas>
      </div>
    );
  }
}

export default Preview;
