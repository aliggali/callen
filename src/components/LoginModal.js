import React, { useState } from "react";
import { Button, Modal, Form, Container, Alert } from "react-bootstrap";
import ModalForm from "../components/ModalForm";
import { useNavigate } from "react-router-dom";

export const LoginModal = ({ show, onHide, isLoggedIn, onClose }) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://spring90.dothome.co.kr/UserLogin.php",
        {
          method: "POST",
          body: new URLSearchParams(loginData).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setResponseMessage(data.userId, data.userName);
      console.log(data.userId, data.userName);

      if (data.message === "로그인 성공!") {
        window.localStorage.setItem("userId", data.userId);
        window.localStorage.setItem("userName", data.userName);
        window.localStorage.setItem("setLogin", true);
        setResponseMessage(data.message);
        setUserName(userName || data.userName);
        onHide();
        isLoggedIn();
        navigate("/home");
        //window.location.reload();
        window.location.href = "http://spring90.dothome.co.kr/test";
      } else {
        // Password incorrect, set error message
        setErrorMessage("Please check your ID or Password again.");
      }
    } catch (error) {
      setResponseMessage("오류: " + error.message);
      setErrorMessage("서버 오류가 발생했습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          onHide();
          // Clear error message when modal is closed
          setErrorMessage("");
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formTitle">
                <Form.Label>Email: </Form.Label>
                <Form.Control
                  type="text"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formDesc">
                <Form.Label>Password:</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <p onClick={() => setSignUpModalOn(true)}>Sign Up</p>
          </Modal.Footer>
        </Container>
      </Modal>
      <ModalForm show={signUpModalOn} onHide={() => setSignUpModalOn(false)} />
    </>
  );
};

export default LoginModal;
