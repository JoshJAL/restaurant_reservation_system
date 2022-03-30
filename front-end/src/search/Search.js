import React, { useState, useMemo } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations } from "../utils/api";
import ReservationRow from "../dashboard/ReservationRow";
import { Link } from "react-router-dom";

export default function Search() {
  const [error, setError] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [mobileNumber, setMobileNumber] = useState("");

  const handleChange = ({ target }) => {
    setMobileNumber(target.value);
  };

  // Returns reservation objects for the matching mobile number
  const handleSubmit = (e) => {
    e.preventDefault();
    const abortController = new AbortController();
    setError(null);

    listReservations({ mobile_number: mobileNumber }, abortController.signal)
      .then(setReservations)
      .catch(setError);
      
      return () => abortController.abort();
    };
  
  // Allows isolation of reservations with status "booked"
  const hasBookedReservations = useMemo(() => reservations.some((res) => res.status === 'booked'), [reservations])

  // Displays results or "No reservations found"
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
            type="tel"
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={mobileNumber}
            pattern="([0-9]{3}-)?[0-9]{3}-[0-9]{4}"
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
            {hasBookedReservations ? new Array(3).fill(<th>Action</th>).map((x) => x) : null}
          </tr>
        </thead>
        <tbody>{results()}</tbody>
      </table>
    </div>
  );
}
