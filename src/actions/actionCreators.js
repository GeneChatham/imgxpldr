// actionCreators.js

// apply a filter
export const APPLY_FILTER = "APPLY_FILTER";
export function applyFilter(filterName) {
  return {
    type: APPLY_FILTER,
    filterName,
  };
}

// // set the DOM element for a canvas
// export const CONNECT_CANVAS = "CONNECT_CANVAS";
// export function connectCanvas(element, name) {
//   return {
//     type: CONNECT_CANVAS,
//     element,
//     name,
//   };
// }

// // signal the reducer to draw the hidden canvas
// export const DRAW_HIDDEN = "DRAW_HIDDEN";
// export function drawHidden() {
//   return {
//     type: DRAW_HIDDEN,
//   };
// }

// // signal the reducer to draw the preview canvas
// export const DRAW_PREVIEW = "DRAW_PREVIEW";
// export function drawPreview() {
//   return {
//     type: DRAW_PREVIEW,
//   };
// }

// use the new paper and poster size data to 
// embiggen the image
export const FIT_TO_POSTER = "FIT_TO_POSTER";
export function fitToPoster() {
  return {
    type: FIT_TO_POSTER
  }
}

// load the selected file for processing
export const LOAD_FILE = "LOAD_FILE";
export function loadFile(file, data, message) {
  return {
    type: LOAD_FILE,
    file,
    data,
    message,
  };
}

export const LOAD_ORIGINAL_IMAGE = "LOAD_ORIGINAL_IMAGE";
export function loadOriginalImage(img, imageData) {
  return {
    type: LOAD_ORIGINAL_IMAGE,
    img,
  };
}

export const ROTATE_IMAGE = "ROTATE_IMAGE";
export function rotateImage() {
  return {
    type: ROTATE_IMAGE,
  };
}

// scroll down to show the bottom of the available elements
export const SCROLL_TO_BOTTOM = "SCROLL_TO_BOTTOM";
export function scrollToBottom(element) {
  return {
    type: SCROLL_TO_BOTTOM,
    element
  }
}

// Select which toolset to show below the preview image.
export const SELECT_TOOLS = "SELECT_TOOLS";
export function selectTools(toolset) {
  return {
    type: SELECT_TOOLS,
    toolset,
  };
}

// Sets the viewport width and height for later canvas sizing
export const SET_VIEWPORT_SIZE = "SET_VIEWPORT_SIZE";
export function setViewportSize(vw, vh) {
  return {
    type: SET_VIEWPORT_SIZE,
    vw,
    vh,
  };
}

// Sets the error message.
export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
export function setErrorMessage(msg) {
  return {
    type: SET_ERROR_MESSAGE,
    msg,
  };
}

// undo the last action - ctx.restore()
export const UNDO = "UNDO";
export function undo() {
  return {
    type: UNDO,
  };
}

// update the size of the paper
export const UPDATE_PAPER_SIZE = "UPDATE_PAPER_SIZE";
export function updatePaperSize(event) {
  return {
    type: UPDATE_PAPER_SIZE,
    val: event.target.value
  }
}

// update the height of the final poster
export const UPDATE_POSTER_HEIGHT = "UPDATE_POSTER_HEIGHT";
export function updatePosterHeight(event) {
  return {
    type: UPDATE_POSTER_HEIGHT,
    val: event.target.value
  }
}

// update the units of measurement for the poster
export const UPDATE_POSTER_UNITS = "UPDATE_POSTER_UNITS";
export function updatePosterUnits(event) {
  return {
    type: UPDATE_POSTER_UNITS,
    val: event.target.value
  }
}

// update the width of the final poster
export const UPDATE_POSTER_WIDTH = "UPDATE_POSTER_WIDTH";
export function updatePosterWidth(event) {
  return {
    type: UPDATE_POSTER_WIDTH,
    val: event.target.value
  }
}
