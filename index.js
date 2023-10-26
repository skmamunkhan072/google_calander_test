const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");
const admin = require("firebase-admin");
dotenv.config();
const { google } = require("googleapis");
const serviceAccount = require("./admin/fir-authcalendertest-4ca25-5d7d4e5b8a94.json");
// const axios = require("axios");

const app = express();
app.use(express.json());
const port = process.env.PORT || 5000;

app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://fir-authcalendertest-4ca25-default-rtdb.firebaseio.com",
});

// Define the required scopes for Google Calendar.
const scopes = ["https://www.googleapis.com/auth/calendar"];
/* // Define the required scopes.
const scopes = [
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/firebase.database',
]; */
// Initialize the Google Calendar API client.
const calendar = google.calendar("v3");

// Create a JWT client using the service account credentials.
const jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  scopes
);

app.get("/get-google-access-token", (req, res) => {
  // Use the JWT client to generate an access token.
  jwtClient.authorize((error, tokens) => {
    if (error) {
      console.log("Error making request to generate access token:", error);
      res.status(500).json({ error: "Failed to generate access token" });
    } else if (tokens.access_token === null) {
      console.log(
        "Provided service account does not have permission to generate access tokens"
      );
      res.status(403).json({ error: "Access denied" });
    } else {
      const accessToken = tokens.access_token;
      // You now have the Google Access Token.

      // Use the Access Token to access Google Calendar.
      calendar.events.list(
        {
          auth: jwtClient,
          calendarId: "primary", // Specify the calendar ID you want to access
        },
        (calendarError, calendarResponse) => {
          if (calendarError) {
            console.error("Error listing calendar events:", calendarError);
            res.status(500).json({ error: "Failed to access Google Calendar" });
          } else {
            const calendarEvents = calendarResponse.data.items;
            res.status(200).json({ access_token: accessToken, calendarEvents });
          }
        }
      );
    }
  });
});

// Use the Google Access Token to create a new event on Google Calendar.
app.post("/create-google-calendar-event", (req, res) => {
  // Use the Google Access Token to create a new event on Google Calendar.
  calendar.events.insert(
    {
      auth: jwtClient,
      calendarId: "primary", // Specify the calendar ID you want to access, we can use user email for Specific client id and can be get calender list for this user
      resource: {
        summary: "Event Title",
        description: "Event Description",
        start: {
          dateTime: "2023-10-25T10:00:00",
          timeZone: "GMT+6",
        },
        end: {
          dateTime: "2023-10-25T11:00:00",
          timeZone: "GMT+6",
        },
      },
    },
    (eventError, eventResponse) => {
      if (eventError) {
        console.error("Error creating calendar event:", eventError);
        res.status(500).json({ error: "Failed to create calendar event" });
      } else {
        const createdEvent = eventResponse.data;
        res.status(200).json({ event: createdEvent });
      }
    }
  );
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

// Your server endpoint to handle the exchange

/* app.post("/exchange-token", async (req, res) => {
  const { firebaseIdToken } = req.body;

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseIdToken);
    console.log(decodedToken);

    // Perform the token exchange
    const response = await axios.post("https://oauth2.googleapis.com/token", {
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: firebaseIdToken,
      scope: "https://www.googleapis.com/auth/calendar",
    });

    const googleAccessToken = response.data.access_token;

    // Use the Google Access Token for the Google Calendar API or other Google services
    // ...

    res.status(200).json({ googleAccessToken });
  } catch (error) {
    console.error(
      "Token exchange error:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Token exchange failed" });
  }
}); */

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
