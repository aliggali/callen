import React, { useState, useCallback, useEffect } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";
import { ChromePicker } from "react-color";

export const CalModal = ({
  selectInfo,
  userId,
  show,
  onHide,
  handelevents,
}) => {
  const [color, setColor] = useState("");
  const [task, setTask] = useState(false);
  const [special, setSpecial] = useState(false);
  const [formData, setFormData] = useState({
    user_id: userId,
    title: "",
    description: "",
    color: "",
    start: "",
    end: "",
    task: task,
    special: special,
  });

  const [responseMessage, setResponseMessage] = useState("");

  const handleColorChange = useCallback((selectedColor) => {
    setColor(selectedColor.hex);
  }, []);

  const handleTask = () => {
    setTask(!task);
    setFormData({ ...formData, task: !task });
  };

  const handleSpecial = () => {
    setSpecial(!special);
    setFormData({ ...formData, special: !special });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const eventData = {
      user_id: userId,
      title: formData.title,
      description: formData.description,
      color: color,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      task: formData.task ? 1 : 0,
      special: formData.special ? 1 : 0,
    };

    console.log("Data being sent to the server:", JSON.stringify(eventData));

    // Send data to the server
    fetch("http://spring90.dothome.co.kr/creat_event.php", {
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
          handelevents();
          setFormData({
            user_id: userId,
            title: "",
            description: "",
            color: "",
            start: "",
            end: "",
            task: false,
            special: false,
          });
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

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Container>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Event Details
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
                checked={formData.task}
                onChange={handleTask}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formSpecial">
              <Form.Check
                type="checkbox"
                label="Set the Spacial day"
                checked={formData.special}
                onChange={handleSpecial}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
          <div id="responseMessage">{responseMessage}</div>
        </Modal.Footer>
      </Container>
    </Modal>
  );
};

export default CalModal;
