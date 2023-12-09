import React, { useState, useEffect } from "react";
import callen from "../../assets/img/logono.png";

import "./Home.css";

export const Home = ({ userId }) => {
  const [taskData, setTaskData] = useState([]);
  const [specialData, setSpecialData] = useState([]);
  const [todayData, setTodayData] = useState([]);
//board styles array
  const boardStyles = [
    { backgroundColor: "#A3C0C4", color: "#fff" },
    { backgroundColor: "#E2E191", color: "#fff" },
  ];

  const loadTask = () => {
    // Fetch events from the server
    fetch("http://spring90.dothome.co.kr/task.php", {
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
          setTaskData(data.tasks);
          console.log(data.tasks);
          console.log(userId);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  const loadSpecial = () => {
    // Fetch events from the server
    fetch("http://spring90.dothome.co.kr/special.php", {
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
          setSpecialData(data.tasks);
          console.log("special:", data.tasks);
          console.log(userId);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  const loadToday = () => {
    // Fetch events from the server
    fetch("http://spring90.dothome.co.kr/today.php", {
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
          setTodayData(data.tasks);
          console.log("today:", data.tasks);
          console.log(userId);
        } else {
          console.error(data.message);
        }
      })
      .catch((error) => console.error("Error fetching events:", error));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Check if the time is "00:00:00", and display only the date
    if (
      date.getHours() === 0 &&
      date.getMinutes() === 0 &&
      date.getSeconds() === 0
    ) {
      return date.toLocaleDateString(); // Format date only
    } else {
      return date.toLocaleString(); // Format date with time
    }
  };

  useEffect(() => {
    // Fetch events from the server
    loadTask();
    loadSpecial();
    loadToday();
  }, []); // Pass an empty dependency array

  return (
    <div className="home-top">
      <div className="boards-container">
        <div className="board" style={boardStyles[0]}>
          <h1>Tasks Board</h1>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {taskData &&
                taskData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="board" style={boardStyles[1]}>
          <h1>Special Days</h1>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {specialData &&
                specialData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{formatDate(item.start)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="board" style={boardStyles[0]}>
          <h1>Today To Do</h1>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>End Date</th>
              </tr>
            </thead>
            <tbody>
              {todayData &&
                todayData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.title}</td>
                    <td>{formatDate(item.end)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="footer-container">
        <img
          src={callen}
          alt="Company Logo"
          className="logo"
          style={{ width: "150px", height: "100px" }}
        />
        <p>&copy; 2023 Callen Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
