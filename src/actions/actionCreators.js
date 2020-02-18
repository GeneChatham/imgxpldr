// actionCreators.js

// for adding a Firebase database
// export const ADD_FIREBASE = "ADD_FIREBASE";

// export function addFirebase(firebase) {
//   return {
//     type: ADD_FIREBASE,
//     firebase
//   };
// }

// load the selected file for processing
export const LOAD_FILE = "LOAD_FILE";
export function loadFile(file) {
  return {
    type: LOAD_FILE,
    file
  }
}