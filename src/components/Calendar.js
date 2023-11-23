// Calendar.js

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { CalModal } from "./CalModal";
import { UpdateModal } from "./UpdateModal";

export const Calendar = ({ userId }) => {
  const [events, setEvents] = useState([]);
  const [selectInfo, setSelectInfo] = useState(null);
  const [calModalOn, setCalModalOn] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updateModalOn, setUpdateModalOn] = useState(false);
  const current = new Date();

  const handelevents = () => {
    fetchEventsFromServer();
  };

  const handelDelete = () => {
    fetchEventsFromServer();
  };

  const handleDateSelect = (selectInfo) => {
    setSelectInfo(selectInfo);
    setCalModalOn(true);
  };

  const handleCalModalClose = () => {
    setCalModalOn(false);
    fetchEventsFromServer();
  };

  const handleEventClick = (clickInfo) => {
    const selectedEvent = events.find(
      (event) => event.id === clickInfo.event.id
    );
    if (!selectedEvent) {
      console.error("Selected event is undefined");
      return;
    }

    setSelectedEvent(selectedEvent);
    setUpdateModalOn(true);
  };

  const handleUpdateModalClose = () => {
    fetchEventsFromServer();
    setUpdateModalOn(false);
  };

  const handleEventDrop = (dropInfo) => {
    console.log(dropInfo);

    // Find the index of the dragged event in the events array
    const indexOfEvent = events.findIndex(
      (event) => event.id === dropInfo.event.id
    );

    console.log(indexOfEvent);
    if (indexOfEvent !== -1) {
      // Update only the dragged event
      const updatedEvents = [...events];
      updatedEvents[indexOfEvent] = {
        ...updatedEvents[indexOfEvent],
        start: dropInfo.event.startStr,
        end: dropInfo.event.endStr,
      };

      setEvents(updatedEvents);
      console.log(updatedEvents);

      // Send data to the server for updating the dragged event
      fetch("http://spring90.dothome.co.kr/update_event.php", {
        method: "POST",
        body: JSON.stringify(updatedEvents[indexOfEvent]),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        mode: "cors",
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.success) {
            console.error(data.message);
          }
        })
        .catch((error) => console.error("Error updating event:", error));
    }
  };

  const fetchEventsFromServer = () => {
    // Fetch events from the server and update the state
    fetch("http://spring90.dothome.co.kr/get_events.php", {
      method: "POST",
      body: new URLSearchParams({ userId }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  useEffect(() => {
    // Fetch events from the server
    fetch("http://spring90.dothome.co.kr/get_events.php", {
      method: "POST",
      body: new URLSearchParams({ userId }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.events);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  }, [userId]);

  return (
    <>
      <div className="calendar-top">
        <FullCalendar
          plugins={[
            dayGridPlugin,
            timeGridPlugin,
            interactionPlugin,
            listPlugin,
          ]}
          initialView="dayGridMonth"
          weekends={true}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          navLinks={true}
          editable={true} // This enables dragging and resizing
          eventDrop={(dropInfo) => handleEventDrop(dropInfo)}
          headerToolbar={{
            start: "prev,next,today",
            center: "title",
            end: "dayGridMonth,dayGridWeek,listWeek",
          }}
          nowIndicator={true}
          now={current}
          height={"100vh"}
          eventColor={"green"}
        />
      </div>

      {calModalOn && (
        <CalModal
          selectInfo={selectInfo}
          userId={userId}
          show={calModalOn}
          onClose={() => setCalModalOn(false)}
          onHide={handleCalModalClose}
          handelevents={handelevents}
        />
      )}

      {updateModalOn && (
        <UpdateModal
          selectedEvent={selectedEvent}
          show={updateModalOn}
          onClose={() => setUpdateModalOn(false)}
          onHide={handleUpdateModalClose}
          handelDelete={handelDelete}
        />
      )}
    </>
  );
};

export default Calendar;
