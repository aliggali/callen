// Calendar.js

import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { CalModal } from "./CalModal";
import { UpdateModal } from "./UpdateModal";
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

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
    setUpdateModalOn(false);
    fetchEventsFromServer();
  };

  const handleEventDrop = (dropInfo) => {
    console.log("dropinfo:", dropInfo);

    // Find the index of the dragged event in the events array
    const indexOfEvent = events.findIndex(
      (event) => event.id === dropInfo.event.id
    );

    const startDate = new Date(dropInfo.event.startStr);
    const endDate = new Date(dropInfo.event.endStr);
    const startD = new Date(dropInfo.event.start);
    const endD = new Date(dropInfo.event.end);
    console.log("start original: ", startD);
    console.log("end original: ", endD);

    // Extract time from existing dates
    const startTime =
      startD.getHours() +
      ":" +
      String(startD.getMinutes()).padStart(2, "0") +
      ":" +
      String(startD.getSeconds()).padStart(2, "0");

    const endTime =
      endD.getHours() +
      ":" +
      String(endD.getMinutes()).padStart(2, "0") +
      ":" +
      String(endD.getSeconds()).padStart(2, "0");

    console.log("startTime: ", startTime);
    console.log("endTime: ", endTime);

    // Format the date to "YYYY-MM-DD HH:mm:ss"
    const formattedStartDate =
      startDate.getFullYear() +
      "-" +
      String(startDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(startDate.getDate()).padStart(2, "0") +
      " " +
      startTime;

    console.log("Formatted Start Date:", formattedStartDate);

    const formattedEndDate = !isNaN(endDate.getTime())
      ? `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(endDate.getDate()).padStart(2, "0")} ${endTime}`
      : formattedStartDate;

    console.log("Formatted End Date:", formattedEndDate);

    console.log("indexOfEvent:", indexOfEvent);

    if (indexOfEvent !== -1) {
      // Update only the dragged event
      const updatedEvents = [...events];
      updatedEvents[indexOfEvent] = {
        ...updatedEvents[indexOfEvent],
        start: formattedStartDate,
        end: formattedEndDate,
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
          } else {
            // Fetch updated events from the server after a successful update
          }
        })
        .catch((error) => console.error("Error updating event:", error));
      fetchEventsFromServer();
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
          // Modify events to remove time part from start and end
          const formattedEvents = data.events.map((event) => {
            return {
              ...event,
              start: event.start.endsWith("00:00:00")
                ? event.start.split(" ")[0]
                : event.start, // Extract date part
              end: event.end.endsWith("00:00:00")
                ? event.end.split(" ")[0]
                : event.end, // Extract date part
            };
          });

          setEvents(formattedEvents);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  useEffect(() => {
    // Fetch events from the server
    if (userId) {
      fetchEventsFromServer();
    }
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
            end: "dayGridMonth,timeGridWeek,listWeek",
          }}
          nowIndicator={true}
          now={current}
          height={"100vh"}
          eventColor={"green"}
          eventDidMount={(info) => {
            const isTimeGridWeek = info.view.type === "timeGridWeek";

            // If the view is timeGridWeek, do not create the popover
            if (isTimeGridWeek) {
              return;
            }

            const taskOption =
              info.event.extendedProps.task == 1 ? "Task " : "";
            const specialOption =
              info.event.extendedProps.special == 1 ? "Special " : "";

            // console.log("task: ", taskOption);
            //console.log("spec: ", specialOption);
            // Determine the title based on task and special options
            const title =
              taskOption && specialOption
                ? "Task & Special Option"
                : taskOption
                ? "Task Option"
                : specialOption
                ? "Special Option"
                : "No Option";

            // Determine the title based on task and special options
            const titleClass =
              title === "Task & Special Option"
                ? "task-special-option"
                : title === "Task Option"
                ? "task-option"
                : title === "Special Option"
                ? "special-option"
                : "no-option";

            return new bootstrap.Popover(info.el, {
              title: `<span class="${titleClass}">${title}</span>`, // Assuming 'title' is the property you want to use
              placement: "bottom",
              trigger: "hover",
              customClass: "popoverStyle",
              content: info.event.extendedProps.description,
              html: true,
            });
          }}
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
          handelevents={handelevents}
        />
      )}
    </>
  );
};

export default Calendar;
