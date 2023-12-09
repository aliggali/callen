import React, { useState, useEffect } from "react";

const EditUser = ({ userId, onSave, existingUserData }) => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    admin_id: "",
  });

  useEffect(() => {
    // Set the initial formData when the component mounts
    setFormData(existingUserData);
  }, [existingUserData]);

  const handleSave = () => {
    fetch("http://spring90.dothome.co.kr/editUser.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        email: formData.email,
        username: formData.username,
        admin_id: formData.admin_id,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        onSave(userId, formData);
        setFormData({
          email: "",
          username: "",
          admin_id: "",
        });
      })
      .catch((error) => {
        console.error("Error updating user:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div>
      <h2>Edit User - ID: {userId}</h2>
      <form>
        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
        <br />
        <label>Admin ID:</label>
        <input
          type="text"
          name="admin_id"
          value={formData.admin_id}
          onChange={handleChange}
        />
        <br />
        <button type="button" onClick={handleSave}>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditUser;
