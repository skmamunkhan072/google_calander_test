import React from "react";

const googelEvent = () => {
  const handleGoogleCalendar = async () => {
    const event = {
      summary: "This is a test event Sk Mamun Khan 072 react",
      description: "some event that is very important",
      start: {
        dateTime: new Date(),
        timeZone: "Asia/Dhaka",
      },
      end: {
        dateTime: new Date(),
        timeZone: "Asia/Dhaka",
      },
    };

    const response = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/primary/events",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ya29.a0AfB_byCEIoBl9jzqP6z-7cwDn3yihebNF_QBzaagXnrqwctR_FyXhf3hBxOcbKl7hrbUOvhtSZQDfh91R_BHDJC2G-AGMFnQOK45TAopsbyGzixpVLbh3XP8Iu3Xkm8ajtpaQY2XyVX_DjsOFRCGvEHA-62hyR0yZv_UaCgYKAQ0SARISFQGOcNnCWdo_Fm1E6FnkhS04LlpvVg0171`,
        },
        body: JSON.stringify(event),
      }
    );

    const eventData = await response.json();
    console.log(eventData);
  };
  return (
    <div>
      <div>
        <button className="btn btn-primary" onClick={handleGoogleCalendar}>
          Set Google Calendar Event
        </button>
      </div>
    </div>
  );
};

export default googelEvent;
