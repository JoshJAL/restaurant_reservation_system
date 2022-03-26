import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, formatPhoneNumber } from "../utils/api";
import ReservationRow from "../dashboard/ReservationRow";
import { Link } from "react-router-dom";

export default function Search() {
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    setError(null);

    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setError);

    return () => abortController.abort();
  };

  const results = () => {
    return reservations.length > 0 ? (
      reservations.map((r) => (
        <ReservationRow key={r.reservation_id} reservation={r} />
      ))
    ) : (
      <tr>
        <td>No reservations found</td>
      </tr>
    );
  };

  return (
    <div
      className="container border rounded"
      style={{ alignItems: "center", width: "100%", padding: "20px 20px" }}
    >
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
          <span className="text-secondary">Search</span>
        </div>
      </div>

      <form style={{ width: "100%" }}>
        <ErrorAlert error={error} />
        <label style={{ width: "100%" }} htmlFor="mobile_number">
          Search:
          <input
            className="form-control"
            id="mobile_number"
            type="number"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={mobileNumber}
            required={true}
          />
        </label>
        <button
          type="submit"
          className="btn btn-info"
          onClick={handleSubmit}
          style={{ marginBottom: "10px" }}
        >
          Search
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Date</th>
            <th>Time</th>
            <th>People</th>
            <th>Status</th>
            <th>Edit</th>
            <th>Cancel</th>
            <th>Seat</th>
          </tr>
        </thead>
        <tbody>{results()}</tbody>
      </table>
    </div>
  );
}
