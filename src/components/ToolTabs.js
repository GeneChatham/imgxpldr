// ToolTabs.js

import React from "react";

import "../css/ToolTabs.css";

class ToolTabs extends React.Component {
  componentDidMount() {
    document.getElementById("toolTabs").scrollIntoView();
  }

  render() {
    const sizePaperClass =
      this.props.app.toolset === "SIZE/PAPER"
        ? "button activeButton"
        : "button";
    const rotateCropClass =
      this.props.app.toolset === "ROTATE/CROP"
        ? "button activeButton"
        : "button";
    const filtersClass =
      this.props.app.toolset === "FILTERS" ? "button activeButton" : "button";
    return (
      <div id="toolTabs">
        <div
          className={rotateCropClass}
          onClick={this.props.selectTools.bind(null, "ROTATE/CROP")}
        >
          rotate/crop
        </div>
        <div
          className={filtersClass}
          onClick={this.props.selectTools.bind(null, "FILTERS")}
        >
          filters
        </div>
        <div
          className={filtersClass}
          onClick={this.props.selectTools.bind(null, "OVERLAY")}
        >
          overlay
        </div>
        <div
          className={sizePaperClass}
          onClick={this.props.selectTools.bind(null, "SIZE/PAPER")}
        >
          size/paper
        </div>
      </div>
    );
  }
}

export default ToolTabs;
