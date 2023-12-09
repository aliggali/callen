import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Calendar } from "./components/Calendar";
import { NavBar } from "./components/kanban/NavBar";
import { Kanbanmain } from "./components/kanban/Kanbanmain";
import { Home } from "./components/kanban/Home";
import { About } from "./components/About";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

function App() {
  const [loginstatus, setLoginstatus] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const callLoginStatus = () => {
    setLoginstatus(window.localStorage.getItem("setLogin"));
    setUserId(window.localStorage.getItem("userId"));
    console.log("userId: ", userId);
    console.log("loginstatus: ", loginstatus);
  };

  useEffect(() => {
    // Check the login status from localStorage and update the state
    callLoginStatus();
    if (loginstatus) {
      setIsLoggedIn(true);
    }
  }, [loginstatus]); // Add loginstatus as a dependency to re-run the effect when it changes
//<Router basename="/test">
  return (
    <>
      <Router>
        <NavBar />
        <div>
          <Routes>
            <Route
              path="/"
              element={
                loginstatus && isLoggedIn ? <Home userId={userId} /> : <About />
              }
            />
            <Route
              path="/home"
              element={
                loginstatus && isLoggedIn ? <Home userId={userId} /> : <About />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/calendar" element={<Calendar userId={userId} />} />
            <Route path="/task" element={<Kanbanmain userId={userId} />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
