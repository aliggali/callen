import React, { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import ModalForm from "./ModalForm";
import { UserLogin } from "./UserLogin";

export const Header = ({ onLoginSuccess }) => {
  const [showLogin, setShowLogin] = useState(true);

  const handleLoginClick = () => {
    setShowLogin(false);
  };
  const [signUpModalOn, setSignUpModalOn] = useState(false);

  return (
    <div>
      <ModalForm show={signUpModalOn} onHide={() => setSignUpModalOn(false)} />
      <header>
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand>Calendar</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav" />
            <Nav className="ml-auto">
              <Nav.Link>
                {showLogin ? (
                  <Button onClick={handleLoginClick}>Login</Button>
                ) : null}
                {showLogin ? null : (
                  <UserLogin onLoginSuccess={onLoginSuccess} />
                )}
              </Nav.Link>
              <Nav.Link>
                {showLogin ? (
                  <Button
                    variant="secondary"
                    onClick={() => setSignUpModalOn(true)}
                  >
                    Sign Up
                  </Button>
                ) : null}
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </header>
    </div>
  );
};

export default Header;
