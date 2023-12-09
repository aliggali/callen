import { Navbar, Container, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/img/logo-bg-white.png";
import { LoginModal } from "../../components/LoginModal";
import { Button } from "react-bootstrap";
import { LogOut } from "react-feather";
import { useNavigate } from "react-router-dom";

import ModalForm from "../../components/ModalForm";

export const NavBar = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [modalLogin, showModalLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const loginSet = window.localStorage.getItem("setLogin");
  const name = window.localStorage.getItem("userName");
  const handleloginModalClose = () => {
    showModalLogin(false);
  };

  const handleLogout = () => {
    // Clear the stored userId and reset login state
    window.localStorage.removeItem("userId");
    window.localStorage.removeItem("userName");
    window.localStorage.removeItem("password");
    window.localStorage.removeItem("setLogin");
    setIsLoggedIn(false);
    console.log("Remove data in localstorage");
    navigate("/about");
    window.location.href = "http://spring90.dothome.co.kr/test";
  };

  const [signUpModalOn, setSignUpModalOn] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    //able scroll

    return () => window.removeEventListener("scroll", onScroll);
    //enable scroll
  }, []);

  const renderUserSection = () => {
    //if login is success, show the user's info
    return (
      <div style={{ verticalAlign: "bottom" }}>
        <h5 className="login-name namebox">{`"${name}"`}</h5>
        <h6 className="login-name">Welcome to Callen</h6>
        <Button
          className="logout-btn"
          //and show logout btn
          onClick={() => {
            handleLogout();
          }}
        >
          <LogOut className="logout-btn" />
        </Button>
      </div>
    );
  };
  //console.log(loginSet);
  return (
    <>
      <div>
        {" "}
        <ModalForm
          show={signUpModalOn}
          onHide={() => setSignUpModalOn(false)}
        />
        <LoginModal
          show={modalLogin}
          onHide={() => showModalLogin(false)}
          isLoggedIn={() => setIsLoggedIn(true)}
          onClose={handleloginModalClose}
        />
        <header>
          <Navbar expand="lg" className={scrolled ? "scrolled" : ""}>
            <Container>
              <Navbar.Brand as={Link} to="/home">
                <img
                  src={logo}
                  alt="Logo"
                  style={{ height: "100px", width: "150px", float: "left" }}
                />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav">
                <span className="navbar-toggler-icon"></span>
              </Navbar.Toggle>
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                  {loginSet ? (
                    <Nav.Link as={Link} className="navbar-link" to="/home">
                      Home
                    </Nav.Link>
                  ) : (
                    <Nav.Link className="navbar-link" to="/about">
                      About
                    </Nav.Link>
                  )}

                  {loginSet ? (
                    <Nav.Link as={Link} className="navbar-link" to="/calendar">
                      Calendar
                    </Nav.Link>
                  ) : (
                    ""
                  )}
                  {loginSet ? (
                    <Nav.Link as={Link} className="navbar-link" to="/task">
                      Task
                    </Nav.Link>
                  ) : (
                    ""
                  )}
                  <Nav.Link>
                    {loginSet ? (
                      renderUserSection()
                    ) : (
                      <p onClick={() => showModalLogin(true)}>Sign In</p>
                    )}
                  </Nav.Link>
                </Nav>
                <span className="navbar-text"></span>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
      </div>
    </>
  );
};
