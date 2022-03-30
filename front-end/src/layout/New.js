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
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const onSubmit = async (e) => {
    const abortController = new AbortController();
    try {
      const reservation = await createReservation(
        { ...formData, people: Number(formData.people) },
        abortController.signal
      );
      history.push(`/dashboard?date=${reservation.reservation_date.substr(0, 10)}`);
    } catch (e) {
      setError(e);
    }
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
        reservationError={error}
      />
    </div>
  );
}
