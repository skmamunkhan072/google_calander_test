// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// import { gapi } from "gapi-script";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHL0um5M2WV0FfEYbLOmF3Ur6iGg6yL1E",
  authDomain: "fir-authcalendertest-4ca25.firebaseapp.com",
  projectId: "fir-authcalendertest-4ca25",
  storageBucket: "fir-authcalendertest-4ca25.appspot.com",
  messagingSenderId: "425482410306",
  appId: "1:425482410306:web:98fe0b929bdad7f5bcd0db",
  measurementId: "G-4BHZBJ156F",
};
// clientId:
//   "425482410306-6cu5hnedobqe24gedavmiikv8cec6fet.apps.googleusercontent.com",
// scopes: ["email", "profile", "https://www.googleapis.com/auth/calendar"],
// discoveryDocs: [
//   "https://calendar-json.googleapis.com/$discovery/rest?version=v3",
// ],

const gapiConfig = {
  apiKey: "AIzaSyDHL0um5M2WV0FfEYbLOmF3Ur6iGg6yL1E",
  clientId:
    "425482410306-6cu5hnedobqe24gedavmiikv8cec6fet.apps.googleusercontent.com",
  discoveryDocs: [
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
  ],
  scope: "https://www.googleapis.com/auth/calendar.readonly",
};

// Initialize Firebase

// Load the Google API client and Firebase

// Load Google API on component mount

// Load the Google API client on component mount
// if (window.gapi) {
//   window.gapi.load("client:auth2", () => {
//     window.gapi.client.init(gapiConfig);
//   });
// }
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
