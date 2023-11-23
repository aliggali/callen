import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { ChromePicker } from "react-color";

export const UpdateModal = ({ selectedEvent, show, close, onHide, handelDelete }) => {
  const [color, setColor] = useState(selectedEvent.color);
  const [formData, setFormData] = useState({
    id: selectedEvent.id,
    user_id: selectedEvent.user_id,
    title: selectedEvent.title,
    description: selectedEvent.description,
    color: selectedEvent.color,
    task: selectedEvent.task,
    special: selectedEvent.special,
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleColorChange = useCallback((selectedColor) => {
    setColor(selectedColor.hex);
  }, []);

  const handleTask = () => {
    const newTaskValue = formData.task === 1 ? 0 : 1; // Toggle between 0 and 1
    setFormData({ ...formData, task: newTaskValue });
  };

  const handleSpecial = () => {
    const newSpecialValue = formData.special === 1 ? 0 : 1; // Toggle between 0 and 1
    setFormData({ ...formData, task: newSpecialValue });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      id: formData.id,
      user_id: formData.user_id,
      title: formData.title,
      description: formData.description,
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
          handelDelete();
        } else {
          setResponseMessage(data.message);
          handelDelete();
        }
      })
      .catch((error) => console.error("Error creating event:", error));

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
          handelDelete();
        }
      })
      .catch((error) => console.error("Error deleting event:", error));
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
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
                label="Set the Spacial day"
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
