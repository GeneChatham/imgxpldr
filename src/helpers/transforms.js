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
