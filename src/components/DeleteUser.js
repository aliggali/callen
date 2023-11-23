import React, { useState } from "react";

const DeleteUser = ({ userId, onDelete }) => {
  const handleDelete = () => {
    fetch("http://spring90.dothome.co.kr/delete_user.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ delete_user_id: userId }).toString(),
      })
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          onDelete(userId); // Notify the parent component to update the user list
        })
        .catch((error) => {
          console.error("Error deleting user:", error);
        });
  };

  return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteUser;
