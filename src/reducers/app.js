// app.js
// main reducer
import { jsPDF } from "jspdf";

import {
  APPLY_FILTER,
  APPLY_OVERLAY,
  // CONNECT_CANVAS,
  // DRAW_PREVIEW,
  // DRAW_HIDDEN,
  FIT_TO_POSTER,
  LOAD_FILE,
  LOAD_ORIGINAL_IMAGE,
  MAKE_PDF,
  ROTATE_IMAGE,
  RESET_REDRAW_FLAG,
  SELECT_TOOLS,
  SET_ERROR_MESSAGE,
  SET_PREVIEW_SCALE,
  SET_VIEWPORT_SIZE,
  SHOW_PROCESSING,
  UNDO,
  UPDATE_PAPER_SIZE,
  UPDATE_POSTER_HEIGHT,
  UPDATE_POSTER_UNITS,
  UPDATE_POSTER_WIDTH,
} from "../actions/actionCreators";

import * as filters from "../helpers/filters";

import circle from "../images/overlays/circle.png";

// import * as transforms from "../helpers/transforms";

function applyFilter(currentCanvas, filter) {
  let filteredPixels = null;
  const ctx = currentCanvas.getContext("2d");
  const pixelsCopy = ctx.getImageData(
    0,
    0,
    currentCanvas.width,
    currentCanvas.height
  );
  // const pixelsCopy = new ImageData(
  //   new Uint8ClampedArray(pixels.data),
  //   pixels.width,
  //   pixels.height
  // );
  switch (filter) {
    case "GRAYSCALE":
      filteredPixels = filters.grayscale(pixelsCopy);
      break;
    default:
      filteredPixels = pixelsCopy;
  }
  const filteredCanvas = document.createElement("canvas");
  filteredCanvas.width = filteredPixels.width;
  filteredCanvas.height = filteredPixels.height;
  const filteredCTX = filteredCanvas.getContext("2d");
  filteredCTX.putImageData(filteredPixels, 0, 0);
  return filteredCanvas;
}

function applyOverlay(canvas) {
  const overlayCanvas = document.createElement("canvas");
  overlayCanvas.width = canvas.width;
  overlayCanvas.height = canvas.height;
  const overlayCTX = overlayCanvas.getContext("2d");
  overlayCTX.imageSmoothingEnabled = false;
  overlayCTX.webkitImageSmoothingEnabled = false;
  overlayCTX.msImageSmoothingEnabled = false;
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = canvas.width * 16;
  screenCanvas.height = canvas.height * 16;
  const screenCTX = screenCanvas.getContext("2d");
  screenCTX.imageSmoothingEnabled = false;
  screenCTX.webkitImageSmoothingEnabled = false;
  screenCTX.msImageSmoothingEnabled = false;
  screenCTX.drawImage(canvas, 0, 0, screenCanvas.width, screenCanvas.height);
  const screenImage = new Image();
  screenImage.src = circle;
  const pattern = screenCTX.createPattern(screenImage, "repeat");
  screenCTX.fillStyle = pattern
  screenCTX.fillRect(0, 0, screenCanvas.width, screenCanvas.height)
  overlayCTX.drawImage(
    screenCanvas,
    0,
    0,
    overlayCanvas.width,
    overlayCanvas.height
  );
  console.log(`screenCanvas:`)
  console.log(screenCanvas)
  return overlayCanvas;
}

// function buildCurrentCanvas(pixels) {
//   const canvas = document.createElement("canvas");
//   canvas.width = pixels.width;
//   canvas.height = pixels.height;
//   const ctx = canvas.getContext("2d");
//   ctx.putImageData(pixels, 0, 0);
//   return canvas;
// }

function buildDebugCanvas(originalCanvas) {
  const debugCanvas = document.createElement("canvas");
  debugCanvas.width = originalCanvas.width;
  debugCanvas.height = originalCanvas.height;
  const debugCTX = debugCanvas.getContext("2d");
  debugCTX.drawImage(originalCanvas, 0, 0);
  return debugCanvas;
}

function buildPDF(canvases, paperSize) {
  console.log(`building PDF...`);
  // check for portrait or lanscape orientation of
  // canvases, then orient paper accordingly
  const paperDimensions = [];
  let printWidth = "";
  let printHeight = "";
  let orientation = "portrait";
  if (canvases[0].width < canvases[0].height) {
    // portrait
    paperDimensions.push(paperSize.width, paperSize.height);
    printWidth = paperSize.width - 1;
    printHeight = paperSize.height - 1;
  } else {
    // lanscape
    paperDimensions.push(paperSize.height, paperSize.width);
    orientation = "landscape";
    printWidth = paperSize.height - 1;
    printHeight = paperSize.width - 1;
  }
  // console.log(`paperDimensions:`);
  // console.log(paperDimensions);
  // create a new pdf
  const doc = new jsPDF({
    format: paperDimensions,
    orientation: orientation,
    unit: paperSize.units,
  });
  // console.log(`doc:`);
  // console.log(doc);
  // console.log(`doc.getFontList():`);
  // console.log(doc.getFontList());
  doc.setFont("Helvetica", "BoldOblique");
  doc.text("IMGXPLDR", 2, 2);
  canvases.forEach((canvas, i) => {
    doc.addPage();
    doc.addImage(
      canvas,
      "PNG",
      0.5,
      0.5,
      printWidth,
      printHeight,
      i,
      "NONE",
      0
    );
  });
  doc.save("imgxpldr.pdf");
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

// return a poster size based on image pixel size
// and a printing resolution
function calcPosterSize(pixelsWide, pixelsHigh, printResolution = 150) {
  return {
    w: (pixelsWide / printResolution).toFixed(2),
    h: (pixelsHigh / printResolution).toFixed(2),
  };
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

// Take and image and put it on a canvas.
// Make that canvas the same size in pixels as the image.
function loadImage(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  // const imageData = ctx.getImageData(0, 0, img.width, img.height);
  return canvas;
}

// enlarge the canvas image to fit the desired poster size
function embiggenCanvas(canvas, width, height, units) {
  const biggerCanvas = document.createElement("canvas");
  // assume units are inches for now
  // plan on 150dpi for printing for now
  biggerCanvas.width = width * 150;
  biggerCanvas.height = height * 150;
  const biggerCTX = biggerCanvas.getContext("2d");
  biggerCTX.imageSmoothingEnabled = false;
  biggerCTX.webkitImageSmoothingEnabled = false;
  biggerCTX.msImageSmoothingEnabled = false;
  biggerCTX.drawImage(canvas, 0, 0, biggerCanvas.width, biggerCanvas.height);
  return biggerCanvas;
}

// extract the pixel data from a canvas
function getCurrentPixels(canvas) {
  const ctx = canvas.getContext("2d");
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function makeCanvases(imgData, units, paperSize, posterWidth, posterHeight) {
  // set print margins - same value top, bottom, and sides
  const MARGIN = 0.5;
  let finalLayout = {};
  // assume portrait layout to begin
  const paperWidth = paperSize.width;
  const paperHeight = paperSize.height;
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
    finalLayout = Object.assign({}, landscapeLayout, {
      orientation: "LANDSCAPE",
    });
  } else {
    finalLayout = Object.assign({}, portraitLayout, {
      orientation: "PORTRAIT",
    });
  }
  console.log(`finalLayout: `, finalLayout);
  // create one big canvas to represent the image printed with excess whitespace
  // find total printable area across pages
  const totalPagesWidth = finalLayout.pagesWide * printableWidth;
  const totalPagesHeight = finalLayout.pagesHigh * printableHeight;
  console.log(
    `totalPagesWidth: ${totalPagesWidth} ${paperSize.units}, totalPagesHeight: ${totalPagesHeight} ${paperSize.units}`
  );
  // calc ratios of printable area across pages to poster size
  const pagesToPosterRatioWidth = totalPagesWidth / posterWidth;
  const pagesToPosterRatioHeight = totalPagesHeight / posterHeight;
  console.log(
    `ratioWidth: ${pagesToPosterRatioWidth}, ratioHeight: ${pagesToPosterRatioHeight}`
  );
  // create a new oversized canvas into which the image can be placed.
  // extra whitespace arround edges represents extra paper.
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
  console.log(`chunkWidth:`);
  console.log(chunkWidth);
  const chunkHeight = bigCanvas.height / finalLayout.pagesHigh;
  console.log(`chunkHeight:`);
  console.log(chunkHeight);
  for (let i = 0; i < bigCanvas.height; i += chunkHeight) {
    for (let j = 0; j < bigCanvas.width; j += chunkWidth) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = chunkWidth;
      tempCanvas.height = chunkHeight;
      const tempCTX = tempCanvas.getContext("2d");
      tempCTX.imageSmoothingEnabled = false;
      tempCTX.webkitImageSmoothingEnabled = false;
      tempCTX.msImageSmoothingEnabled = false;
      const startX = j;
      const startY = i;
      tempCTX.putImageData(
        imgData,
        -startX,
        -startY,
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

function parsePaperSize(val) {
  console.log(`parsePaperSize for: ${val}`);
  switch (val) {
    case "8.5x11":
      return { width: 8.5, height: 11, units: "in" };
    default:
      // default to standard letter
      return { width: 8.5, height: 11, units: "in" };
  }
}

// function rotateImage(pixels) {
//   const rotatedPixels = transforms.rotate(pixels);
//   return rotatedPixels;
// }

// as ImageData object cannot be put into a transformed (rotated)
// canvas, first draw image data to canvas1.  Then rotate canvas2 context
// and draw canvas1.  Finally, extract the new pixel ImageData from canvas2.
// Copy the currentCanvas to a new, rotated canvas to avoid mutating
// the currentCanvas.  Return that new rotated canvas.
function rotateImage(currentCanvas) {
  const rotatedCanvas = document.createElement("canvas");
  rotatedCanvas.width = currentCanvas.height;
  rotatedCanvas.height = currentCanvas.width;
  const ctxR = rotatedCanvas.getContext("2d");
  // save the unrotated context of the canvas so we can restore it later
  ctxR.save();
  // // move to the center of the canvas
  ctxR.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
  // // rotate the canvas to the specified degrees
  ctxR.rotate(Math.PI / 2);
  // // draw the image
  // // since the context is rotated, the image will be rotated also
  ctxR.drawImage(
    currentCanvas,
    -rotatedCanvas.height / 2,
    -rotatedCanvas.width / 2
  );
  // ctx2.putImageData(bitmap, -canvas.height / 2, -canvas.width /2);
  ctxR.restore();
  // return canvas2;
  return rotatedCanvas;
}

function app(state = {}, action) {
  switch (action.type) {
    case APPLY_FILTER:
      const filtered = applyFilter(state.currentCanvas, action.filterName);
      return Object.assign({}, state, {
        currentCanvas: filtered,
        currentPixels: getCurrentPixels(filtered),
        redrawFlag: true,
        saveStack: state.saveStack.concat([filtered]),
      });
    case APPLY_OVERLAY:
      const overlayed = applyOverlay(state.currentCanvas);
      return Object.assign({}, state, {
        currentCanvas: overlayed,
        currentPixels: getCurrentPixels(overlayed),
        redrawFlag: true,
        saveStack: state.saveStack.concat([overlayed]),
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
      const currentCanvas = loadImage(action.img);
      // const currentCanvas = buildCurrentCanvas(currentPixels);
      const previewSize = calcCanvasSize(
        state.viewportWidth,
        state.viewportHeight,
        currentCanvas.width,
        currentCanvas.height
      );
      const posterSize = calcPosterSize(
        currentCanvas.width,
        currentCanvas.height
      );
      return Object.assign({}, state, {
        currentCanvas: currentCanvas,
        currentPixels: getCurrentPixels(currentCanvas),
        debugCanvas: buildDebugCanvas(currentCanvas),
        previewWidth: previewSize.w,
        previewHeight: previewSize.h,
        message: null,
        originalImage: action.img,
        paperSize: { width: 8.5, height: 11, units: "in" },
        posterHeight: posterSize.h,
        posterUnits: "inches",
        posterWidth: posterSize.w,
        previewScale: "FIT",
        redrawFlag: true,
        saveStack: [currentCanvas],
      });
    case MAKE_PDF:
      const pdfCanvas = makeCanvases(
        state.currentPixels,
        state.posterUnits,
        state.paperSize,
        state.posterWidth,
        state.posterHeight
      );
      buildPDF(pdfCanvas.pageCanvases, state.paperSize);
      return Object.assign({}, state, {
        pdfCanvas: pdfCanvas.bigCanvas,
        pageCanvases: pdfCanvas.pageCanvases,
      });
    case RESET_REDRAW_FLAG:
      return Object.assign({}, state, {
        redrawFlag: false,
      });
    case ROTATE_IMAGE:
      const rotated = rotateImage(state.currentCanvas);
      const rotatedPreviewSize = calcCanvasSize(
        state.viewportWidth,
        state.viewportHeight,
        rotated.width,
        rotated.height
      );
      return Object.assign({}, state, {
        currentCanvas: rotated,
        currentPixels: getCurrentPixels(rotated),
        previewWidth: rotatedPreviewSize.w,
        previewHeight: rotatedPreviewSize.h,
        redrawFlag: true,
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
    case SET_PREVIEW_SCALE:
      return Object.assign({}, state, {
        previewScale: action.val,
      });
    case SET_VIEWPORT_SIZE:
      const tempImgSize = state.currentCanvas
        ? { w: state.currentCanvas.width, h: state.currentCanvas.height }
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
        redrawFlag: true,
      });
    case SHOW_PROCESSING:
      return Object.assign({}, state, {
        showProcessing: action.val,
      });
    case UNDO:
      const undoStack = [].concat(state.saveStack);
      if (undoStack.length > 1) {
        undoStack.pop();
      }
      const undoneCanvas = undoStack[undoStack.length - 1];
      const undonePreviewSize = calcCanvasSize(
        state.viewportWidth,
        state.viewportHeight,
        undoneCanvas.width,
        undoneCanvas.height
      );
      return Object.assign({}, state, {
        currentCanvas: undoneCanvas,
        currentPixels: getCurrentPixels(undoneCanvas),
        previewWidth: undonePreviewSize.w,
        previewHeight: undonePreviewSize.h,
        redrawFlag: true,
        saveStack: undoStack,
      });
    case UPDATE_PAPER_SIZE:
      const paperDimensions = parsePaperSize(action.val);
      return Object.assign({}, state, {
        paperSize: paperDimensions,
      });
    case UPDATE_POSTER_HEIGHT:
      if (!isNaN(Number(action.val)) && Number(action.val) > 0) {
        const linkedWidth =
          Number(action.val) *
          (state.currentCanvas.width / state.currentCanvas.height);
        // const embiggenedHeight = embiggenCanvas(
        //   state.currentCanvas,
        //   linkedWidth,
        //   action.val,
        //   state.posterUnits
        // );
        return Object.assign({}, state, {
          // currentCanvas: embiggenedHeight,
          // currentPixels: getCurrentPixels(embiggenedHeight),
          posterHeight: action.val,
          posterWidth: linkedWidth.toFixed(2),
        });
      } else {
        return Object.assign({}, state, {
          posterHeight: action.val,
        });
      }
    case UPDATE_POSTER_UNITS:
      return Object.assign({}, state, {
        posterUnits: action.val,
      });
    case UPDATE_POSTER_WIDTH:
      if (!isNaN(Number(action.val)) && Number(action.val) > 0) {
        const linkedHeight =
          Number(action.val) /
          (state.currentCanvas.width / state.currentCanvas.height);
        // const embiggenedWidth = embiggenCanvas(
        //   state.currentCanvas,
        //   action.val,
        //   linkedHeight,
        //   state.posterUnits
        // );
        return Object.assign({}, state, {
          // currentCanvas: embiggenedWidth,
          // currentPixels: getCurrentPixels(embiggenedWidth),
          posterHeight: linkedHeight.toFixed(2),
          posterWidth: action.val,
        });
      } else {
        return Object.assign({}, state, {
          posterWidth: action.val,
        });
      }
    default:
      return state;
  }
}

export default app;
