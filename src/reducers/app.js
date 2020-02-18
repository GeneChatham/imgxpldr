// app.js
// main reducer

import {
  LOAD_FILE
} from "../actions/actionCreators";

function app(state = {}, action) {
  switch (action.type) {
    case LOAD_FILE:
      return Object.assign({}, state, {
        file: action.file
      });
    default:
      return state;
  }
};

export default app