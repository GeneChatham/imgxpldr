import React from "react";
import "../css/FileSelector.css";

class FileSelector extends React.Component {
  constructor(props) {
    super(props);
    this.handleInput = this.handleInput.bind(this);
    this.fileInput = React.createRef();
  }

  handleInput(event) {
    event.preventDefault();
    if(this.fileInput.current.files) {
      console.log(`Selected file - ${this.fileInput.current.files[0].name}`);
      console.log(this.fileInput.current.files[0]);
    }
  }

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
