const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const admin = require("firebase-admin");
dotenv.config();
const serviceAccount = require("./admin/fir-authcalendertest-4ca25-5d7d4e5b8a94.json");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-authcalendertest-4ca25-default-rtdb.firebaseio.com",
});

// app.post("/verifyIdToken", async (req, res) => {
//   const idToken = req.headers.idtoken;
//   const requestBody = {
//     grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
//     assertion: idToken,
//   };

//   const googleClientId =
//     "425482410306-6cu5hnedobqe24gedavmiikv8cec6fet.apps.googleusercontent.com";
//   const googleClientSecret = "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";

//   const authHeader =
//     "Basic " +
//     Buffer.from(googleClientId + ":" + googleClientSecret).toString("base64");
//   let googleToken = "";
//   axios
//     .post("https://oauth2.googleapis.com/token", requestBody, {
//       headers: {
//         Authorization: authHeader,
//         "Content-Type": "application/json",
//       },
//     })
//     .then((response) => {
//       console.log(response, "response");
//       const googleAccessToken = response.data.access_token;
//       googleToken = googleAccessToken;
//       console.log(googleAccessToken, "googleAccessToken");
//       // Use the Google access token to access the Google Calendar API
//     })
//     .catch((error) => {
//       console.log(error, "error");
//       // Handle errors
//     });
// });

app.get("/verifyIdToken", async (req, res) => {
  const idToken = req.headers.idtoken;
  //   console.log(idToken);
  try {
    // Verify the ID token and get the user's UID
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Exchange the Firebase ID token for a Google access token
    const auth = await admin.auth().getUser(uid);

    // Set custom claims when creating or updating a user
    admin
      .auth()
      .setCustomUserClaims(uid, idToken)
      .then(() => {
        console.log("Initial googleAccessToken set for the user.");
      })
      .catch((error) => {
        console.error("Error setting custom claims:", error);
      });

    console.log(auth);
    if (auth && auth.customClaims && auth.customClaims.googleAccessToken) {
      const googleAccessToken = auth.customClaims.googleAccessToken;
      console.log(googleAccessToken);
      // Proceed with using the Google access token.
    } else {
      console.error("Google access token not found in custom claims.");
      res.status(500).send("Google access token not found in custom claims.");
    }
  } catch (error) {
    console.error("Error accessing Google Calendar API:", error);
    res.status(500).send("Error accessing Google Calendar API");
  }
});

app.get("/", (req, res) => {
  res.send({
    status: "success",
    message: "google_calendar_and_blogger_test_server is running",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
