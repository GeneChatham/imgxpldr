// app.js
// main reducer
import { jsPDF } from "jspdf";

import {
  APPLY_FILTER,
  // CONNECT_CANVAS,
  // DRAW_PREVIEW,
  // DRAW_HIDDEN,
  FIT_TO_POSTER,
  LOAD_FILE,
  LOAD_ORIGINAL_IMAGE,
  MAKE_PDF,
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
  const pixelsCopy = new ImageData(
    new Uint8ClampedArray(pixels.data),
    pixels.width,
    pixels.height
  );
  switch (filter) {
    case "GRAYSCALE":
      filteredPixels = filters.grayscale(pixelsCopy);
      break;
    default:
      filteredPixels = pixels;
  }
  return filteredPixels;
}

function buildPDF(canvases) {
  console.log(`building PDF...`);
  const doc = new jsPDF({
    format: [8.5, 11],
    unit: "in",
  });
  canvases.forEach((canvas, i) => {
    doc.addPage({
      format: [8.5, 11],
      orientation: "portrait",
    })
    doc.addImage(canvas, "PNG", 0.5, 0.5, 7.5, 10, i, "NONE", 0);
  });
  doc.save("testCat.pdf");
};

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

function calcPageLayout(
  printableWidth,
  printableHeight,
  posterWidth,
  posterHeight
) {
  const excessWide = posterWidth % printableWidth;
  const excessHigh = posterHeight % printableHeight;
  const pagesWide = Math.ceil(posterWidth / printableWidth);
  const pagesHigh = Math.ceil(posterHeight / printableHeight);
  const totalPages = pagesWide * pagesHigh;
  return { excessWide, excessHigh, pagesWide, pagesHigh, totalPages };
}

// function fitToPoster(pixels, posterWidth, posterHeight, posterUnits) {
//   const fittedPixels = transforms.fitToPoster(
//     pixels,
//     posterWidth,
//     posterHeight,
//     posterUnits
//   );
//   return fittedPixels;
// }

function loadPixels(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  const imageData = ctx.getImageData(0, 0, img.width, img.height);
  return imageData;
}

function makeCanvases(imgData, units, paperSize, posterWidth, posterHeight) {
  // set print margins - same value top, bottom, and sides
  const MARGIN = 0.5;
  let finalLayout = {};
  // assume portrait layout to begin
  const paperWidth = paperSize.split("x")[0];
  const paperHeight = paperSize.split("x")[1];
  let printableWidth = paperWidth - MARGIN * 2;
  let printableHeight = paperHeight - MARGIN * 2;
  console.log(
    `paperWidth: ${paperWidth}, paperHeight: ${paperHeight}, printableWidth: ${printableWidth}, printableHeight: ${printableHeight}`
  );
  const portraitLayout = calcPageLayout(
    printableWidth,
    printableHeight,
    posterWidth,
    posterHeight
  );
  const landscapeLayout = calcPageLayout(
    printableHeight,
    printableWidth,
    posterWidth,
    posterHeight
  );
  if (landscapeLayout.totalPages < portraitLayout.totalPages) {
    // reassign height and width for landscape layout
    printableWidth = paperHeight - MARGIN * 2;
    printableHeight = paperWidth - MARGIN * 2;
    finalLayout = landscapeLayout;
  } else {
    finalLayout = portraitLayout;
  }
  console.log(`finalLayout: `, finalLayout);
  // create one big canvas to represent the image printed with excess whitespace
  const totalPagesWidth = finalLayout.pagesWide * printableWidth;
  const totalPagesHeight = finalLayout.pagesHigh * printableHeight;
  console.log(
    `totalPagesWidth: ${totalPagesWidth}, totalPagesHeight: ${totalPagesHeight}`
  );
  const pagesToPosterRatioWidth = totalPagesWidth / posterWidth;
  const pagesToPosterRatioHeight = totalPagesHeight / posterHeight;
  console.log(
    `ratioWidth: ${pagesToPosterRatioWidth}, ratioHeight: ${pagesToPosterRatioHeight}`
  );
  const bigCanvas = document.createElement("canvas");
  bigCanvas.width = Math.round(imgData.width * pagesToPosterRatioWidth);
  bigCanvas.height = Math.round(imgData.height * pagesToPosterRatioHeight);
  const bigCTX = bigCanvas.getContext("2d");
  bigCTX.putImageData(imgData, 0, 0);
  console.log(`bigCanvas:`);
  console.log(bigCanvas);
  // export pieces of bigCTX to series of smaller canvases
  // starting at top left, iterate through each row of pages.
  const pageCanvases = [];
  const chunkWidth = bigCanvas.width / finalLayout.pagesWide;
  const chunkHeight = bigCanvas.height / finalLayout.pagesHigh;
  for (let i = 0; i < totalPagesHeight; i += chunkHeight) {
    for (let j = 0; j < totalPagesWidth; j += chunkWidth) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = chunkWidth;
      tempCanvas.height = chunkHeight;
      const tempCTX = tempCanvas.getContext("2d");
      const startX = chunkWidth * j;
      const startY = chunkHeight * i;
      tempCTX.putImageData(
        imgData,
        0,
        0,
        startX,
        startY,
        chunkWidth,
        chunkHeight
      );
      pageCanvases.push(tempCanvas);
    }
  }
  return { bigCanvas, pageCanvases };
}

function rotateImage(pixels) {
  const rotatedPixels = transforms.rotate(pixels);
  return rotatedPixels;
}

function app(state = {}, action) {
  switch (action.type) {
    case APPLY_FILTER:
      const filtered = applyFilter(state.currentPixels, action.filterName);
      return Object.assign({}, state, {
        currentPixels: filtered,
        saveStack: state.saveStack.concat([filtered]),
      });
    case FIT_TO_POSTER:
      // const fitted = fitToPoster(
      //   state.currentPixels,
      //   state.posterWidth,
      //   state.posterHeight,
      //   state.posterUnits
      // );
      // return Object.assign({}, state, {
      //   currentPixels: fitted,
      //   saveStack: state.saveStack.concat([fitted]),
      // });
      return state;
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
    case MAKE_PDF:
      const pdfCanvas = makeCanvases(
        state.currentPixels,
        state.posterUnits,
        state.paperSize,
        state.posterWidth,
        state.posterHeight
      );
      buildPDF(pdfCanvas.pageCanvases);
      return Object.assign({}, state, {
        pdfCanvas: pdfCanvas.bigCanvas,
        pageCanvases: pdfCanvas.pageCanvases,
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
        action.val * (state.currentPixels.width / state.currentPixels.height);
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
        action.val / (state.currentPixels.width / state.currentPixels.height);
      return Object.assign({}, state, {
        posterHeight: linkedHeight.toFixed(2),
        posterWidth: +action.val,
      });
    default:
      return state;
  }
}

export default app;
