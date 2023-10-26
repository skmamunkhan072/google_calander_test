const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const dayjs = require("dayjs");

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const calendar = google.calendar({
  version: "v3",
  auth: process.env.CALENDAR_API_KEY,
});

// const blogger = google.blogger({
//   version: "v3",
//   auth: process.env.BLOGGER_API_KEY,
// });

const calendarScopes = ["https://www.googleapis.com/auth/calendar"];
// "https://www.googleapis.com/auth/blogger",

app.get("/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: calendarScopes,
    state: uuidv4(),
  });

  console.log(authUrl);
  res.send({
    state: "success",
    authUrl,
    message: "Please visit the provided URL to authenticate with Google.",
  });
});

app.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const calendarEvents = await calendar.events.list({
      calendarId: "primary",
      auth: oauth2Client,
    });

    // const bloggerBlogs = await blogger.blogs.listByUser({
    //   userId: "self",
    //   auth: oauth2Client,
    // });

    res.send({
      message: "Successfully authenticated with Google and retrieved tokens.",
      tokens,
      calendarEvents: calendarEvents.data.items,
      // bloggerBlogs: bloggerBlogs.data.items,
    });
  } catch (error) {
    console.error("OAuth2 Error:", error.message);
    res.status(500).send("Error during OAuth2 authentication.");
  }
});

// schedule event
// schedule event
app.get("/schedule_event", async (req, res) => {
  try {
    // Check if the OAuth2 client has a valid access token
    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token) {
      throw new Error("OAuth2 token is missing or expired.");
    }

    await calendar.events.insert({
      calendarId: "primary",
      auth: oauth2Client, // Use the valid OAuth2 token for authentication
      conferenceDataVersion: 1,
      requestBody: {
        summary: "This is a test event Sk Mamun Khan 072",
        description: "some event that is very important",
        start: {
          dateTime: dayjs(new Date()).add(1, "day").toISOString(),
          timeZone: "Asia/Dhaka",
        },
        end: {
          dateTime: dayjs(new Date())
            .add(1, "day")
            .add(5, "hour")
            .toISOString(),
          timeZone: "Asia/Dhaka",
        },
        conferenceData: {
          createRequest: {
            requestId: uuidv4(),
          },
        },
        attachments: {
          email: "skmamunkhan0909@gmail.com",
        },
      },
    });

    res.send({ msg: "Event scheduled successfully." });
  } catch (error) {
    console.error("Error scheduling event:", error.message);
    res.status(500).send("Error scheduling event.");
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
