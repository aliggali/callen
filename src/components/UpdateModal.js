import React, { useState, useCallback } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { ChromePicker } from "react-color";

export const UpdateModal = ({ selectedEvent, show, onHide, handelevents }) => {
  //Split the time and date of the start and end dates
  const startTimeArray = selectedEvent.start.split(" ");
  const startDate = startTimeArray[0];
  const startTimeOnly = startTimeArray[1];
  //console.log("startdate:", startDate);
  //console.log("startTimeOnly:", startTimeOnly);

  const endTimeArray = selectedEvent.end.split(" ");
  const endDate = endTimeArray[0];
  const endTimeOnly = endTimeArray[1];
  //console.log("endDate:", startDate);
  //console.log("endTimeOnly:", startTimeOnly);

  const [color, setColor] = useState(selectedEvent.color);
  const [formData, setFormData] = useState({
    id: selectedEvent.id,
    user_id: selectedEvent.user_id,
    title: selectedEvent.title,
    description: selectedEvent.description,
    startTime: startTimeOnly,
    endTime: endTimeOnly,
    color: selectedEvent.color,
    task: selectedEvent.task,
    special: selectedEvent.special,
  }); // Load data in form

  const [addTime, setAddTime] = useState(false);

  const toggleAddTime = () => {
    setAddTime(!addTime);
  }; // Time option

  const [responseMessage, setResponseMessage] = useState("");
  // receive message from php server

  const handleColorChange = useCallback((selectedColor) => {
    setColor(selectedColor.hex);
  }, []); // change format color to hex

  const handleTask = () => {
    const newTaskValue = formData.task === 1 ? 0 : 1; // Toggle between 0 and 1
    setFormData({ ...formData, task: newTaskValue });
  }; //task option

  const handleSpecial = () => {
    const newSpecialValue = formData.special === 1 ? 0 : 1; // Toggle between 0 and 1
    setFormData({ ...formData, special: newSpecialValue });
  }; //special option

  const handleSubmit = (e) => {
    e.preventDefault();
    const setEndDate = new Date(endDate); //Extract date only

    const formattedEndDate = // when update data, the date set automatically adding 1 what I clicked date
      setEndDate.getFullYear() +
      "-" +
      String(setEndDate.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(setEndDate.getDate() - 1).padStart(2, "0"); // so minus 1

    console.log("Formatted End Date:", formattedEndDate);

    //endTimeOnly is equal to startTimeOnly and addTime is false -> 00:00:00
    const setNewStart =
      !addTime && endTimeOnly === startTimeOnly
        ? "00:00:00"
        : formData.startTime;
    const setNewEnd =
      !addTime && endTimeOnly === startTimeOnly ? "00:00:00" : formData.endTime;

    //console.log(setNewStart);
    //console.log(setNewEnd);

    // update data set
    const eventData = {
      id: formData.id,
      user_id: formData.user_id,
      title: formData.title,
      description: formData.description,
      start: startDate + " " + setNewStart,
      end: endDate + " " + setNewEnd,
      color: color,
      task: formData.task,
      special: formData.special,
    };

    console.log("Data being sent to the server:", JSON.stringify(eventData));

    // Send data to the server
    fetch("http://spring90.dothome.co.kr/edit_event.php", {
      method: "POST",
      body: JSON.stringify(eventData),
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
          setResponseMessage(data.message);
        }
      })
      .catch((error) => console.error("Error creating event:", error));
    window.location.replace("/calendar");
    //handelevents();
    // Close the modal
    onHide();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const clickDelete = () => {
    const eventId = selectedEvent.id;

    // Assuming handelUpdate performs an update action on the client side

    console.log("Data being sent to the server:", JSON.stringify({ eventId }));

    // Send data to the server for deletion
    fetch("http://spring90.dothome.co.kr/delete_event.php", {
      method: "POST",
      body: JSON.stringify({ id: eventId }),
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
        }
      })
      .catch((error) => console.error("Error deleting event:", error));
    handelevents();
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Event Update OR Delete
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formTitle">
              <Form.Label>Title: </Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter Title"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formDesc">
              <Form.Label>Description:</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter Description"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAddTime">
              <Form.Check
                type="checkbox"
                label="Add Or Edit Time"
                checked={addTime}
                onChange={toggleAddTime}
              />
            </Form.Group>
            {addTime &&
              (startTimeOnly !== endTimeOnly ||
                startTimeOnly === endTimeOnly) && (
                <div className="form-row">
                  <Form.Group className="col-md-4" controlId="formStartTime">
                    <Form.Label>Start Time:</Form.Label>
                    <Form.Control
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="col-md-4" controlId="formEndTime">
                    <Form.Label>End Time:</Form.Label>
                    <Form.Control
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </div>
              )}

            <Form.Group className="mb-3" controlId="formColor">
              <Form.Label>Color:</Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                placeholder="Color"
              />
              <ChromePicker
                color={color}
                onChange={(color) => handleColorChange(color)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formTask">
              <Form.Check
                type="checkbox"
                label="Task/To do List"
                checked={formData.task == 1}
                onChange={handleTask}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSpecial">
              <Form.Check
                type="checkbox"
                label="Set the Special day"
                checked={formData.special == 1}
                onChange={handleSpecial}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={clickDelete}>The event delete</Button>
          <div id="responseMessage">{responseMessage}</div>
        </Modal.Footer>
      </Container>
    </Modal>
  );
};

export default UpdateModal;
