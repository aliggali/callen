import React, { useState, useEffect } from "react";
import DeleteUser from "./DeleteUser"; // Make sure to provide the correct path
import EditUser from "./EditUser";

export const Loaduser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    fetch("http://spring90.dothome.co.kr/loadUser.php")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, []);

  const handleEdit = (userId) => {
    setEditingUserId(userId);
  };

  const handleSave = (userId, updatedData) => {
    // Perform your save logic here, e.g., make a fetch request to update the user data
    // You can customize this part based on your server-side implementation

    // For demonstration purposes, let's assume a successful save
    console.log(`User with ID ${userId} updated with data:`, updatedData);

    // Reset the editing state
    setEditingUserId(null);
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, ...updatedData } : user
      )
    );
  };

  const handleDelete = (deletedUserId) => {
    // Update the user list after a successful delete
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== deletedUserId)
    );
  };

  return (
    <div>
      <h1>User List</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Username</th>
              <th>Admin ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.admin_id}</td>
                <td>
                  {editingUserId === user.id ? (
                    <EditUser
                      userId={user.id}
                      onSave={handleSave}
                      existingUserData={user}
                    />
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user.id)}>Edit</button>
                      <DeleteUser userId={user.id} onDelete={handleDelete} />
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
