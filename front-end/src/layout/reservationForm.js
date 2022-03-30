import React from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";

export default function ReservationForm({
  onSubmit,
  formData,
  handleChange,
	reservationError,
}) {
  const history = useHistory();

  return (
    <div>
      <form style={{ width: "100%" }}>
        <label style={{ width: "100%" }} htmlFor="first_name">
          First Name:
          <input
            className="form-control"
            id="first_name"
            type="text"
            name="first_name"
            placeholder="First Name"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={formData?.first_name ?? ""}
            required={true}
          />
        </label>
        <br />
        <label style={{ width: "100%" }} htmlFor="last_name">
          Last Name:
          <input
            className="form-control"
            id="lastName"
            type="text"
            name="last_name"
            placeholder="Last Name"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={formData?.last_name ?? ""}
            required={true}
          />
        </label>
        <br />
        <label style={{ width: "100%" }} htmlFor="mobile_number">
          Mobile Number:
          <input
            className="form-control"
            id="mobileNumber"
            type="tel"
            name="mobile_number"
            placeholder="Mobile Number"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={formData?.mobile_number ?? ""}
            pattern="([0-9]{3}-)?[0-9]{3}-[0-9]{4}"
            required={true}
          />
        </label>
        <br />
        <label style={{ width: "100%" }} htmlFor="reservation_date">
          Reservation Date:
          <input
            className="form-control"
            id="reservation_date"
            type="date"
            name="reservation_date"
            placeholder="Reservation Date"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={formData?.reservation_date ?? ""}
            required={true}
          />
        </label>
        <br />
        <label style={{ width: "100%" }} htmlFor="reservation_time">
          Reservation Time:
          <input
            className="form-control"
            id="reservation_time"
            type="time"
            name="reservation_time"
            placeholder="Reservation Time"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={formData?.reservation_time ?? ""}
            required={true}
          />
        </label>
        <br />
        <label style={{ width: "100%" }} htmlFor="people">
          Number of People:
          <input
            className="form-control"
            id="people"
            type="number"
            min="0"
            name="people"
            placeholder="0"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={formData?.people ?? ""}
            required={true}
          />
        </label>
        <ErrorAlert error={reservationError} />
      </form>

      <div className="row" style={{ marginBottom: '15px'}}>
        <button
          type="button"
          style={{ marginRight: "10px", marginLeft: "15px" }}
          className="btn btn-secondary"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-info" onClick={onSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}
