import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const GoogleVarify = () => {
  const location = useLocation();
  const { search } = location;

  useEffect(async () => {
    // Extract query parameters from the URL (e.g., code, state)
    const params = new URLSearchParams(search);
    const code = params.get("code");
    const state = params.get("state");
    console.log(code);

    try {
      const { tokens } = await oauth2Client.getToken(code);
      oauth2Client.setCredentials(tokens);

      const calendarEvents = await calendar.events.list({
        calendarId: "primary",
        auth: oauth2Client,
      });

      console.log(calendarEvents.data.items);
    } catch (error) {
      console.error("Error handling OAuth callback:", error);
      // Handle the error as needed (e.g., show an error message to the user)
    }
  }, [search]);

  return <div>hello</div>;
};
