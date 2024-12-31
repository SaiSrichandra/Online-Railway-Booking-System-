import React from "react";
import { Link } from "react-router-dom";

const ManageEmployeesLink = () => {
  return (
    <div style={{ marginBottom: "20px" }}>
      <Link to="/admin/employees" style={{ textDecoration: "none", fontWeight: "bold" }}>
        Manage Employees
      </Link>
    </div>
  );
};

export default ManageEmployeesLink;
