// have the following required and not-nullable fields:
// Table name: <input name="table_name" />, which must be at least 2 characters long.
// Capacity: <input name="capacity" />, this is the number of people that can be seated at the table, which must be at least 1 person.
// display a Submit button that, when clicked, saves the new table then displays the /dashboard page
// display a Cancel button that, when clicked, returns the user to the previous page

import React, { useState } from "react";
import { Link } from "react-router-dom";
import TableForm from "./TableForm";

const initialFormState = {
  table_name: "",
  capacity: "",
};

export default function NewTable() {
  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  return (
    <div className="container">
      <div
        style={{ margin: "10px 0" }}
        className="h5 row border rounded bg-light"
      >
        <div className="breadcrumbContainer" style={{ margin: "15px" }}>
          <Link to={"/dashboard"} className="text-primary">
            <span className="oi oi-home" /> Dashboard
          </Link>
          <span style={{ margin: "0 5px" }} className="text-secondary">
            /
          </span>
          <span className="text-secondary">Create Table</span>
        </div>
      </div>

      <TableForm
        method={"POST"}
        handleChange={handleChange}
        formData={formData}
      />
    </div>
  );
}
