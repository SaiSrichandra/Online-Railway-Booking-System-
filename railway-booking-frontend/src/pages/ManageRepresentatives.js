import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const ManageRepresentatives = () => {
  const [representatives, setRepresentatives] = useState([]);
  const [newRep, setNewRep] = useState({
    ssn: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    employeeType: "Staff",
  });
  const [editRep, setEditRep] = useState(null);
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  

  // Fetch all representatives
  useEffect(() => {
    const fetchRepresentatives = async () => {
      try {
        const response = await axiosInstance.get("/admin/employees");
        setRepresentatives(response.data.employees || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch representatives.");
      }
    };
    fetchRepresentatives();
  }, []);

  // Handle input changes for adding/editing
  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditRep((prev) => ({ ...prev, [name]: value }));
    } else {
      setNewRep((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle add representative
  const handleAddRep = async () => {
    try {
      const trimmedRep = {
        ssn: newRep.ssn.trim(),
        firstName: newRep.firstName.trim(),
        lastName: newRep.lastName.trim(),
        username: newRep.username.trim(),
        password: newRep.password.trim(),
        employeeType: newRep.employeeType, // Either 'Admin' or 'Staff'
      };
  
      // Validate required fields
      if (
        !trimmedRep.ssn ||
        !trimmedRep.firstName ||
        !trimmedRep.lastName ||
        !trimmedRep.username ||
        !trimmedRep.password
      ) {
        setError("All fields are required.");
        return;
      }
  
      // Make API request
      const response = await axiosInstance.post("/admin/employees", trimmedRep);
  
      // Append the new employee to the state
      setRepresentatives((prev) => [
        ...prev,
        {
          EmpID: response.data.empId,
          FirstName: trimmedRep.firstName,
          LastName: trimmedRep.lastName,
          Username: trimmedRep.username,
          Password: "********", // Masked password
          SSN: "***********", // Masked SSN
          EmployeeType: trimmedRep.employeeType,
        },
      ]);
  
      // Reset the form and clear messages
      setNewRep({
        ssn: "",
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        employeeType: "Staff", // Default to 'Staff'
      });
      setSuccess("Representative added successfully.");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to add representative.");
    }
  };
  
  

  // Edit a representative
  const handleEditRep = async () => {
    if (
      !editRep?.ssn?.trim() ||
      !editRep?.firstName?.trim() ||
      !editRep?.lastName?.trim() ||
      !editRep?.username?.trim() ||
      !editRep?.password?.trim() ||
      !editRep?.employeeType?.trim()
    ) {
      setError("All fields are required.");
      return;
    }
  
    try {
      // API call to update representative
      const response = await axiosInstance.put(`/admin/employees/${editRep.EmpID}`, {
        ssn: editRep.ssn,
        firstName: editRep.firstName,
        lastName: editRep.lastName,
        username: editRep.username,
        password: editRep.password,
        employeeType: editRep.employeeType,
      });
  
      if (response?.data?.message === "Employee updated successfully") {
        // Fetch updated representatives list after successful API call
        const updatedResponse = await axiosInstance.get("/admin/employees");
        setRepresentatives(updatedResponse.data.employees || []);
  
        setEditRep(null); // Close the edit form
        setSuccess("Representative updated successfully.");
        setError("");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error updating representative:", err);
      setError("Failed to update representative.");
    }
  };
  
  
  
  // Delete a representative
  const handleDeleteRep = async (id) => {
    if (!window.confirm("Are you sure you want to delete this representative?")) return;
  
    try {
      // API call to delete the representative
      const response = await axiosInstance.delete(`/admin/employees/${id}`);
  
      if (response?.data?.message === "Employee deleted successfully") {
        // Re-fetch the updated representatives list after deletion
        const updatedResponse = await axiosInstance.get("/admin/employees");
        setRepresentatives(updatedResponse.data.employees || []);
  
        setSuccess("Representative deleted successfully.");
        setError("");
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error deleting representative:", err);
      setError("Failed to delete representative.");
    }
  };


  return (
    <div>
      <h1>Manage Customer Representatives</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

    <table>
        <thead>
            <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Username</th>
            <th>Password</th>
            <th>SSN</th>
            <th>Role</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {representatives.map((rep) => (
            <tr key={rep.EmpID}>
                <td>{rep.EmpID}</td>
                <td>{rep.FirstName}</td>
                <td>{rep.LastName}</td>
                <td>{rep.Username}</td>
                <td>{"*".repeat(rep.Password.length)}</td>
                <td>{"*".repeat(rep.SSN.length)}</td>
                <td>{rep.EmployeeType}</td>
                <td>
                <button onClick={() => setEditRep({ ...rep })}>Edit</button>
                <button onClick={() => handleDeleteRep(rep.EmpID)}>Delete</button>
                </td>
            </tr>
            ))}
        </tbody>
    </table>   

    {editRep && (
  <div>
    <h2>Edit Representative</h2>
    <input
      type="text"
      name="ssn"
      value={editRep.ssn}
      placeholder="SSN"
      onChange={(e) => handleInputChange(e, true)}
    />
    <input
      type="text"
      name="firstName"
      value={editRep.firstName}
      placeholder="First Name"
      onChange={(e) => handleInputChange(e, true)}
    />
    <input
      type="text"
      name="lastName"
      value={editRep.lastName}
      placeholder="Last Name"
      onChange={(e) => handleInputChange(e, true)}
    />
    <input
      type="text"
      name="username"
      value={editRep.username}
      placeholder="Username"
      onChange={(e) => handleInputChange(e, true)}
    />
    <input
      type="password"
      name="password"
      value={editRep.password}
      placeholder="Password"
      onChange={(e) => handleInputChange(e, true)}
    />
    <select
      name="employeeType"
      value={editRep.employeeType}
      onChange={(e) => handleInputChange(e, true)}
    >
      <option value="Admin">Admin</option>
      <option value="Staff">Staff</option>
    </select>
    <button onClick={handleEditRep}>Update</button>
    <button onClick={() => setEditRep(null)}>Cancel</button>
  </div>
)}

<h2>Add New Representative</h2>
<form
  onSubmit={(e) => {
    e.preventDefault();
    handleAddRep();
  }}
>
  <input
    type="text"
    name="ssn"
    value={newRep.ssn}
    placeholder="SSN"
    onChange={(e) => handleInputChange(e)}
  />
  <input
    type="text"
    name="firstName"
    value={newRep.firstName}
    placeholder="First Name"
    onChange={(e) => handleInputChange(e)}
  />
  <input
    type="text"
    name="lastName"
    value={newRep.lastName}
    placeholder="Last Name"
    onChange={(e) => handleInputChange(e)}
  />
  <input
    type="text"
    name="username"
    value={newRep.username}
    placeholder="Username"
    onChange={(e) => handleInputChange(e)}
  />
  <input
    type="password"
    name="password"
    value={newRep.password}
    placeholder="Password"
    onChange={(e) => handleInputChange(e)}
  />
  <select
    name="employeeType"
    value={newRep.employeeType}
    onChange={(e) => handleInputChange(e)}
  >
    <option value="Staff">Staff</option>
    <option value="Admin">Admin</option>
  </select>
  <button type="submit">Add</button>
</form>

    </div>
  );
};

export default ManageRepresentatives;
