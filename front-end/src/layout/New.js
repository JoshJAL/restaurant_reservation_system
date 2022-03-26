// The /reservations/new page will
// have the following required and not-nullable fields:
// First name: <input name="first_name" />
// Last name: <input name="last_name" />
// Mobile number: <input name="mobile_number" />
// Date of reservation: <input name="reservation_date" />
// Time of reservation: <input name="reservation_time" />
// Number of people in the party, which must be at least 1 person. <input name="people" />
// display a Submit button that, when clicked, saves the new reservation, then displays the /dashboard page for the date of the new reservation
// display a Cancel button that, when clicked, returns the user to the previous page
// display any error messages returned from the API

import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import ReservationForm from "./reservationForm";
import { createReservation } from "../utils/api";

const initialFormState = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "",
  people: "",
};

export default function New() {
  const history = useHistory();

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const onSubmit = async (e) => {
    const abortController = new AbortController();
    console.log(formData);
    const reservation = await createReservation(
      { ...formData, people: Number(formData.people) },
      abortController.signal
    );
    history.push(`/dashboard/${reservation.id}`);
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
          <span className="text-secondary">Create Reservation</span>
        </div>
      </div>

      <ReservationForm
        method={"POST"}
        handleChange={handleChange}
        formData={formData}
        onSubmit={onSubmit}
      />
    </div>
  );
}
