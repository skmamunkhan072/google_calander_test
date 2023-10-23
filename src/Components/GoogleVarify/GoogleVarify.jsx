import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
// const { google } = require("googleapis");

const GoogleVarify = () => {
  //   const location = useLocation();
  //   const { search } = location;

  //   const oauth2Client = new google.auth.OAuth2(
  //     "735596575612-su9mk24kb9m5ti0ggrgdu9ufu3qaf68p.apps.googleusercontent.com",
  //     "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",
  //     "http://localhost:3000/google/callback"
  //   );

  //   const calendar = google.calendar({
  //     version: "v3",
  //     auth: process.env.CALENDAR_API_KEY,
  //   });

  //   const tokenGenerator = async (code) => {
  //     const { tokens } = await oauth2Client.getToken(code);
  //     oauth2Client.setCredentials(tokens);

  //     const calendarEvents = await calendar.events.list({
  //       calendarId: "primary",
  //       auth: oauth2Client,
  //     });

  //     console.log(calendarEvents.data.items);
  //   };

  //   useEffect(() => {
  //     // Extract query parameters from the URL (e.g., code, state)
  //     const params = new URLSearchParams(search);
  //     const code = params.get("code");
  //     const state = params.get("state");
  //     console.log(code);
  //     // tokenGenerator(code);
  //   }, [search]);

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default GoogleVarify;
