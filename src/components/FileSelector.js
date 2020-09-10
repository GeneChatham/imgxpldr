import React from "react";

import * as imageHelpers from "../helpers/imageHelpers";
import "../css/FileSelector.css";

class FileSelector extends React.Component {
  constructor(props) {
    super(props);
    this.fileInput = React.createRef();
  }

  handleInput = event => {
    event.preventDefault();
    if (this.fileInput.current.files.length > 0) {
      const file = this.fileInput.current.files[0];
      imageHelpers.loadFile(this.props.dispatch, file);
    }
  };

  render() {
    return (
      <div className="FileSelector">
        <label className="customFileUpload">
          choose img to xpld
          <input type="file" ref={this.fileInput} onChange={this.handleInput} />
        </label>
      </div>
    );
  }
}

export default FileSelector;
