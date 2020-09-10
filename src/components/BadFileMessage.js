// BadFileMessage.js

import React from "react";

import "../css/BadFileMessage.css";

function BadFileMessage({ message }) {
  return (
    <div className="BadFileMessage">
      {message}
    </div>
  );
}

export default BadFileMessage;