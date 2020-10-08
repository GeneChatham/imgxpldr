// app.js
// main reducer

import {
  APPLY_FILTER,
  // CONNECT_CANVAS,
  // DRAW_PREVIEW,
  // DRAW_HIDDEN,
  FIT_TO_POSTER,
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

function applyFilter(pixels, filter) {
  let filteredPixels = null;
  const pixelsCopy = new ImageData(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height);
  switch (filter) {
    case "GRAYSCALE":
      filteredPixels = filters.grayscale(pixelsCopy);
      break;
    default:
      filteredPixels = pixels;
  }
  return filteredPixels;
}

function calcCanvasSize(vw, vh, imgWidth, imgHeight) {
  // console.log(`imgWidth: ${imgWidth}`);
  // console.log(`imgHeight: ${imgHeight}`);
  let result = { w: 0, h: 0 };
  if (imgWidth !== undefined) {
    const viewportAR = vw / vh;
    const imageAR = imgWidth / imgHeight;
    if (viewportAR >= imageAR) {
      // limiting size is viewport height
      result.h = vh * 0.75;
      result.w = imageAR * result.h;
    } else {
      // limiting size is viewport width
      result.w = vw * 0.8;
      result.h = (1 / imageAR) * result.w;
    }
  }
  return result;
}

function fitToPoster(ctx, posterWidth, posterHeight, posterUnits, canvas) {
  const fittedPixels = transforms.fitToPoster(
    ctx,
    posterWidth,
    posterHeight,
    posterUnits
  );
  // canvas.width = fittedPixels.width;
  // canvas.height = fittedPixels.height;
  ctx.putImageData(fittedPixels, 0, 0);
  return fittedPixels;
}

function loadPixels(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  return imageData;
}

function rotateImage(pixels) {
  const rotatedPixels = transforms.rotate(pixels);
  // const oldw = canvas.width;
  // const oldh = canvas.height;
  // canvas.width = oldh;
  // canvas.height = oldw;
  // ctx.putImageData(rotatedPixels, 0, 0);
  return rotatedPixels;
}

function app(state = {}, action) {
  switch (action.type) {
    case APPLY_FILTER:
      const filtered = applyFilter(
        state.currentPixels,
        action.filterName,
      );
      return Object.assign({}, state, {
        currentPixels: filtered,
        saveStack: state.saveStack.concat([filtered]),
      });
    case FIT_TO_POSTER:
      return Object.assign({}, state, {
        hiddenPixels: fitToPoster(
          state.hiddenCTX,
          state.posterWidth,
          state.posterHeight,
          state.posterUnits,
          state.hiddenCanvas
        ),
      });
    case LOAD_FILE:
      return Object.assign({}, state, {
        file: action.file,
        fileData: action.data,
      });
    case LOAD_ORIGINAL_IMAGE:
      const currentPixels = loadPixels(action.img);
      const previewSize = calcCanvasSize(
        state.viewportWidth,
        state.viewportHeight,
        currentPixels.width,
        currentPixels.height
      );
      return Object.assign({}, state, {
        currentPixels: currentPixels,
        previewWidth: previewSize.w,
        previewHeight: previewSize.h,
        message: null,
        originalImage: action.img,
        paperSize: "8.5x11",
        posterHeight: 0,
        posterUnits: "inches",
        posterWidth: 0,
        saveStack: [currentPixels],
      });
    case ROTATE_IMAGE:
      const rotated = rotateImage(state.currentPixels);
      const rotatedPreviewSize = calcCanvasSize(
        state.viewportWidth,
        state.viewportHeight,
        rotated.width,
        rotated.height
      );
      return Object.assign({}, state, {
        currentPixels: rotated,
        previewWidth: rotatedPreviewSize.w,
        previewHeight: rotatedPreviewSize.h,
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
      const tempImgSize = state.currentPixels
        ? { w: state.currentPixels.width, h: state.currentPixels.height }
        : { w: undefined, h: undefined };
      const tempPreviewSize = calcCanvasSize(
        action.vw,
        action.vh,
        tempImgSize.w,
        tempImgSize.h
      );
      return Object.assign({}, state, {
        viewportWidth: action.vw,
        viewportHeight: action.vh,
        previewWidth: tempPreviewSize.w,
        previewHeight: tempPreviewSize.h,
      });
    case UNDO:
      const undoStack = [].concat(state.saveStack);
      if (undoStack.length > 1) {
        undoStack.pop();
      }
      const undoneImageData = undoStack[undoStack.length - 1];
      const undonePreviewSize = calcCanvasSize(
        state.viewportWidth,
        state.viewportHeight,
        undoneImageData.width,
        undoneImageData.height
      );
      return Object.assign({}, state, {
        currentPixels: undoneImageData,
        previewWidth: undonePreviewSize.w,
        previewHeight: undonePreviewSize.h,
        saveStack: undoStack,
      });
    case UPDATE_PAPER_SIZE:
      return Object.assign({}, state, {
        paperSize: action.val,
      });
    case UPDATE_POSTER_HEIGHT:
      const linkedWidth =
        action.val * (state.hiddenPixels.width / state.hiddenPixels.height);
      return Object.assign({}, state, {
        posterHeight: +action.val,
        posterWidth: linkedWidth.toFixed(2),
      });
    case UPDATE_POSTER_UNITS:
      return Object.assign({}, state, {
        posterUnits: action.val,
      });
    case UPDATE_POSTER_WIDTH:
      const linkedHeight =
        action.val / (state.hiddenPixels.width / state.hiddenPixels.height);
      return Object.assign({}, state, {
        posterHeight: linkedHeight.toFixed(2),
        posterWidth: +action.val,
      });
    default:
      return state;
  }
}

export default app;
