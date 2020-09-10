// imageHelpers.js
// All the functions for handling image
// loading and manipulation.

// import LoadImage from "blueimp-load-image";

import * as actions from "../actions/actionCreators";

export function loadFile(dispatch, file) {
  if (!file.type.startsWith("image/")) {
    dispatch(actions.setErrorMessage(`not a valid img file to xpld!`))
  } else {
    const reader = new FileReader();
    reader.onload = e => {
      // convert image file to base64 string
      // dispatch(actions.loadFile(file, e.target.result, null));
      const img = new Image();
      img.onload = () => {
        dispatch(actions.loadOriginalImage(img));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

// export function loadFile(dispatch, file) {
//   if (!file.type.startsWith("image/")) {
//     dispatch(actions.setErrorMessage(`not a valid img file to xpld!`))
//   } else {
//     LoadImage(
//       file,
//       function(img, data) {
//         if(img.type === "error") {
//           dispatch(actions.setErrorMessage(`image failed to load`));
//         } else {
//           // console.log(`window.devicePixelRatio: ${window.devicePixelRatio}`);
//           // console.log(img);
//           // console.log("Original image head: ", data.imageHead);
//           // console.log("Exif data: ", data.exif); // requires exif extension
//           // console.log("IPTC data: ", data.iptc); // requires iptc extension
//           dispatch(actions.loadOriginalImage(img, data));
//         }
//       },
//       { canvas: true,
//         meta: true,
//         orientation: true,
//         // pixelRatio: window.devicePixelRatio
//        }
//     );
//   }
// }
