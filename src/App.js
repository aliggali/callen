import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Calendar } from "./components/Calendar";
import { NavBar } from "./components/kanban/NavBar";
import { Kanbanmain } from "./components/kanban/Kanbanmain";
import { Home } from "./components/kanban/Home";
import { About } from "./components/About";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

function App() {
  const loginstatus = window.localStorage.getItem("setLogin");
  const [currentLogin, setCurrentLogin] = useState(true);
  const userId = window.localStorage.getItem("userId");

  // 로그인 정보 가져오기

  return (
    <>
      <Router>
        <NavBar />
        <div>
          <Routes>
            <Route
              path="/"
              element={
                currentLogin && loginstatus ? (
                  <Home userId={userId} />
                ) : (
                  <About />
                )
              }
            />
            <Route
              path="/home"
              element={
                currentLogin && loginstatus ? (
                  <Home userId={userId} />
                ) : (
                  <About />
                )
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
