import React, { useState } from "react";

export const Adduser = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    admin_id: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

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
    <div>
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="text"
          name="admin_id"
          value={formData.admin_id}
          onChange={handleChange}
          placeholder="Admin ID"
        />
        <button type="submit">Save</button>
      </form>
      <div id="responseMessage">{responseMessage}</div>
    </div>
  );
};
