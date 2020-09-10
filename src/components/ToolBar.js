// ToolBar.js

import React from "react";

import "../css/ToolBar.css";
import SizeAndPaper from "./SizeAndPaper";

class ToolBar extends React.Component {
  componentDidMount() {
    document.getElementById("toolBar").scrollIntoView();
  }

  rotateHandler = () => {
    this.props.rotateImage();
    document.getElementById("toolBar").scrollIntoView();
  };

  undoHandler = () => {
    this.props.undo();
    document.getElementById("toolBar").scrollIntoView();
  };

  getToolset = (toolsetName) => {
    console.log(`getting toolset ${toolsetName}...`);
    const undo = (
      <div className="toolBarButton" onClick={this.undoHandler}>
        <span id="undoArrow">{"\u293a "}</span>
        {"undo"}
      </div>
    );
    const rotateAndCrop = (
      <div id="toolBar">
        {undo}
        <div className="toolBarButton" onClick={this.rotateHandler}>
          {"rotate \u21bb"}
        </div>
      </div>
    );
    const size = (
      <div id="toolBar">
        <SizeAndPaper {...this.props} />
      </div>
    );
    const filters = (
      <div id="toolBar">
        {undo}
        <div
          className="toolBarButton"
          onClick={this.props.applyFilter.bind(null, "GRAYSCALE")}
        >
          {"grayscale"}
        </div>
      </div>
    );
    switch (toolsetName) {
      case "ROTATE/CROP":
        return rotateAndCrop;
      case "SIZE/PAPER":
        return size;
      case "FILTERS":
        return filters;
      default:
        return null;
    }
  };

  render() {
    const html = this.getToolset(this.props.app.toolset);
    return html;
  }
}

export default ToolBar;

//Christopher Mason LAMP