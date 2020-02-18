import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import FileSelector from "./FileSelector";
import * as actionCreators from "../actions/actionCreators";
import "../css/App.css";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    ...bindActionCreators(actionCreators, dispatch),
    dispatch
  };
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h2>imgxpldr</h2>
      </header>
      <FileSelector />
    </div>
  );
}

// export default App;
export default connect(mapStateToProps, mapDispatchToProps)(App);
