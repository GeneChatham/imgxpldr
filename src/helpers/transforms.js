// transforms.js

// Rotate the image a number of degrees clockwise
export const rotate = (pixels, deg) => {
  console.log(`pixels:`);
  console.log(pixels);
  const temp = [];
  const twoDee = build2Dmatrix(pixels);
  twoDee.forEach((column) => {
    for (let i = column.length - 1; i >= 0; i--) {
      const pixel = column[i];
      pixel.forEach((val) => {
        temp.push(val);
      });
    }
  });
  const rotated = Uint8ClampedArray.from(temp);
  console.log(`temp:`);
  console.log(temp);
  return new ImageData(rotated, pixels.height, pixels.width);
};

const build2Dmatrix = (pixels) => {
  const oneDee = [];
  const twoDee = [];
  for (let i = 0; i < pixels.data.length; i += 4) {
    const wholePixel = [
      pixels.data[i],
      pixels.data[i + 1],
      pixels.data[i + 2],
      pixels.data[i + 3],
    ];
    oneDee.push(wholePixel);
  }
  console.log(`oneDee:`);
  console.log(oneDee);
  oneDee.forEach((pixel, j) => {
    let column = j % pixels.width;
    let rowCount = Math.floor(j / pixels.width);
    if (twoDee[column] === undefined) {
      twoDee[column] = [];
    }
    twoDee[column][rowCount] = pixel;
  });
  return twoDee;
};

// take one pixel of data and enlarge it by scaleFactor
// into a 2D array of single pixels.
const embiggenPixel = (pixel, scaleFactor) => {
  const bigPixel = [];
  for (let row = 0; row < scaleFactor; row++) {
    bigPixel[row] = [];
    for (let column = 0; column < scaleFactor; column++) {
      bigPixel[row][column] = pixel;
    }
  }
  return bigPixel;
};

// take an array of embiggened pixels and unpack them into
// a flat array of pixel data.
const unpackBigPixels = (
  bigPixels,
  originalWidth,
  originalHeight,
  scaleFactor
) => {
  console.log(
    `originalWidth: ${originalWidth}, originalHeight: ${originalHeight}`
  );
  let results = [];
  for (let row = 0; row < originalHeight; row++) {
    for (let i = 0; i < originalWidth; i++) {
      for (let j = 0; j < scaleFactor; j++) {
        let offset = row * originalWidth;
        bigPixels[offset + i][j].forEach((pixel) => {
          // console.log(`bigPixels[${row + i}][${j}] = `, pixel);
          pixel.forEach((val) => {
            results.push(val);
          });
        });
      }
    }
  }
  console.log(`unpacking results:`);
  console.log(results);
  return results;
};

// Embiggen the image to fit the desired poster size.
// Use 300ppi for printing.
export const fitToPoster = (ctx, posterWidth, posterHeight, units) => {
  console.log(
    `fitting to poster - w:${posterWidth}, h:${posterHeight}, ${units}...`
  );
  const tempPixels = ctx.getImageData(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height
  );
  // convert to inches if needed
  const targetWidth = units === "inches" ? posterWidth : posterWidth / 2.54;
  const pixelsWidth = targetWidth * 300;
  const scaleFactor = Math.floor(pixelsWidth / tempPixels.width);
  const actualWidth = tempPixels.width * scaleFactor;
  const actualHeight = tempPixels.height * scaleFactor;
  console.log(`scaleFactor: ${scaleFactor}`);
  const bigPixels = [];
  for (let i = 0; i < tempPixels.data.length; i += 4) {
    const wholePixel = [
      tempPixels.data[i],
      tempPixels.data[i + 1],
      tempPixels.data[i + 2],
      tempPixels.data[i + 3],
    ];
    const bigPixel = embiggenPixel(wholePixel, scaleFactor);
    bigPixels.push(bigPixel);
  }
  console.log(`bigPixels:`);
  console.log(bigPixels);
  const fittedPixels = unpackBigPixels(
    bigPixels,
    tempPixels.width,
    tempPixels.height,
    scaleFactor
  );
  const fitted = Uint8ClampedArray.from(fittedPixels);
  console.log(`actualWidth: ${actualWidth}, actualHeight: ${actualHeight}`);
  return new ImageData(fitted, actualWidth, actualHeight);
};
