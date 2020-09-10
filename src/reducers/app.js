// app.js
// main reducer

import {
  APPLY_FILTER,
  CONNECT_CANVAS,
  DRAW_PREVIEW,
  DRAW_HIDDEN,
  LOAD_FILE,
  LOAD_ORIGINAL_IMAGE,
  ROTATE_IMAGE,
  SELECT_TOOLS,
  SET_ERROR_MESSAGE,
  SET_VIEWPORT_SIZE,
  UNDO,
  UPDATE_PAPER_SIZE,
  UPDATE_POSTER_HEIGHT,
  UPDATE_POSTER_UNITS,
  UPDATE_POSTER_WIDTH,
} from "../actions/actionCreators";

import * as filters from "../helpers/filters";

import * as transforms from "../helpers/transforms";

function applyFilter(pixels, filter, ctx) {
  const tempPixels = ctx.getImageData(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );
  let filteredPixels = null;
  switch (filter) {
    case "GRAYSCALE":
      filteredPixels = filters.grayscale(tempPixels);
      break;
    default:
      filteredPixels = tempPixels;
  }
  ctx.putImageData(filteredPixels, 0, 0);
  return filteredPixels;
}

function applyUndone(imageData, ctx, canvas) {
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
}

function calcCanvasSize(vw, vh, img) {
  let result = { w: 0, h: 0 };
  if (img !== undefined) {
    result = {
      w: 0,
      h: 0,
    };
    const viewportAR = vw / vh;
    const imageAR = img.width / img.height;
    if (viewportAR >= imageAR) {
      // limiting size is viewport height
      result.h = vh * 0.9;
      result.w = imageAR * result.h;
    } else {
      // limiting size is viewport width
      result.w = vw * 0.9;
      result.h = (1 / imageAR) * result.w;
    }
  }
  return result;
}

function drawHidden(ctx, img) {
  ctx.drawImage(img, 0, 0);
  const drawnPixels = ctx.getImageData(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );
  return drawnPixels;
}

function drawPreview(ctx, img, canvasSize) {
  ctx.drawImage(img, 0, 0, canvasSize.w, canvasSize.h);
}

function rotateImage(pixels, ctx, canvas) {
  const rotatedPixels = transforms.rotate(pixels);
  const oldw = canvas.width;
  const oldh = canvas.height;
  canvas.width = oldh;
  canvas.height = oldw;
  ctx.putImageData(rotatedPixels, 0, 0);
  return rotatedPixels;
}

function app(state = {}, action) {
  switch (action.type) {
    case APPLY_FILTER:
      const filtered = applyFilter(
        state.hiddenPixels,
        action.filterName,
        state.hiddenCTX
      );
      return Object.assign({}, state, {
        hiddenPixels: filtered,
        saveStack: state.saveStack.concat([filtered]),
      });
    case CONNECT_CANVAS:
      const canvasName = `${action.name}Canvas`;
      const ctxName = `${action.name}CTX`;
      return Object.assign({}, state, {
        [canvasName]: action.element,
        [ctxName]: action.element.getContext("2d"),
      });
    case DRAW_HIDDEN:
      const hiddenPixels = drawHidden(state.hiddenCTX, state.currentImage);
      return Object.assign({}, state, {
        hiddenPixels: hiddenPixels,
        saveStack: state.saveStack.concat([hiddenPixels]),
      });
    case DRAW_PREVIEW:
      drawPreview(
        state.previewCTX,
        state.hiddenCanvas,
        state.displayCanvasSize
      );
      return state;
    case LOAD_FILE:
      return Object.assign({}, state, {
        file: action.file,
        fileData: action.data,
      });
    case LOAD_ORIGINAL_IMAGE:
      return Object.assign({}, state, {
        currentImage: action.img,
        displayCanvasSize: calcCanvasSize(
          state.viewportWidth,
          state.viewportHeight,
          action.img
        ),
        hiddenCanvasSize: { w: action.img.width, h: action.img.height },
        message: null,
        originalImage: action.img,
        originalMetadata: action.metadata,
        paperSize: "8.5x11",
        posterHeight: 0,
        posterUnits: "inches",
        posterWidth: 0,
        saveStack: [],
      });
    case ROTATE_IMAGE:
      const rotated = rotateImage(
        state.hiddenPixels,
        state.hiddenCTX,
        state.hiddenCanvas
      );
      return Object.assign({}, state, {
        hiddenPixels: rotated,
        saveStack: state.saveStack.concat([rotated]),
      });
    case SELECT_TOOLS:
      return Object.assign({}, state, {
        toolset: action.toolset,
      });
    case SET_ERROR_MESSAGE:
      return Object.assign({}, state, {
        message: action.msg,
        currentImage: null,
      });
    case SET_VIEWPORT_SIZE:
      return Object.assign({}, state, {
        viewportWidth: action.vw,
        viewportHeight: action.vh,
        displayCanvasSize: calcCanvasSize(
          action.vw,
          action.vh,
          state.currentImage
        ),
      });
    case UNDO:
      const undoStack = [].concat(state.saveStack);
      if (undoStack.length > 1) {
        undoStack.pop();
      }
      const undoneImageData = undoStack[undoStack.length - 1];
      applyUndone(undoneImageData, state.hiddenCTX, state.hiddenCanvas);
      return Object.assign({}, state, {
        saveStack: undoStack,
        hiddenPixels: undoneImageData,
      });
    case UPDATE_PAPER_SIZE:
      return Object.assign({}, state, {
        paperSize: action.val,
      });
    case UPDATE_POSTER_HEIGHT:
      const linkedWidth =
        action.val * (state.hiddenPixels.width / state.hiddenPixels.height);
      console.log("linkedWidth:");
      console.log(linkedWidth);
      return Object.assign({}, state, {
        posterHeight: action.val,
        posterWidth: linkedWidth.toFixed(2),
      });
    case UPDATE_POSTER_UNITS:
      return Object.assign({}, state, {
        posterUnits: action.val,
      });
    case UPDATE_POSTER_WIDTH:
      const linkedHeight =
        action.val / (state.hiddenPixels.width / state.hiddenPixels.height);
      console.log("linkedHeight:");
      console.log(linkedHeight);
      return Object.assign({}, state, {
        posterHeight: linkedHeight.toFixed(2),
        posterWidth: action.val,
      });
    default:
      return state;
  }
}

export default app;