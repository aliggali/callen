import React, { useState } from "react";
import { Button, Modal, Form, Container } from "react-bootstrap";


const ModalForm = ({ show, onHide }) => {
  const [responseMessage, setResponseMessage] = useState("");
  const clientId =
    "1016109770011-55vvk7d5e9rr0psqgdre08rvritgg302.apps.googleusercontent.com";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://spring90.dothome.co.kr/your-php-save-script.php", {
      method: "POST",
      body: new URLSearchParams(formData).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      mode: "cors",
    })
      .then((response) => response.text())
      .then((data) => {
        setResponseMessage(data);
        onHide();
      })
      .catch((error) => {
        setResponseMessage("오류: " + error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Container style={{ zIndex: 1050 }}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Sign Up
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter Name"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  valuee={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
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
    </>
  );
};

export default ModalForm;
