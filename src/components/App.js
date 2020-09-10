import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import BadFileMessage from "./BadFileMessage";
import FileSelector from "./FileSelector";
import Preview from "./Preview";
import ToolBar from "./ToolBar";
import ToolTabs from "./ToolTabs";

import * as actionCreators from "../actions/actionCreators";
import "../css/App.css";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(actionCreators, dispatch),
    dispatch,
  };
}

class App extends React.Component {
  componentDidMount() {
    this.getViewportSize();
    window.addEventListener("resize", this.getViewportSize);
  }

  getViewportSize = () => {
    const vw = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const vh = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
    this.props.setViewportSize(vw, vh);
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2>imgxpldr</h2>
        </header>
        <FileSelector {...this.props} />
        {this.props.app.message && (
          <BadFileMessage message={this.props.app.message} />
        )}
        {this.props.app.currentImage && <Preview {...this.props} />}
        {this.props.app.currentImage && <ToolTabs {...this.props} />}
        {this.props.app.toolset && <ToolBar {...this.props} />}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
