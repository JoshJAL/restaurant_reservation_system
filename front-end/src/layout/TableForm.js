import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "./ErrorAlert";
import { getReservation } from "../utils/api";
import { createTable } from "../utils/api";

export default function ReservationForm({ method, loadDashboard }) {
  const history = useHistory();
  const [tableError, setTableError] = useState(null);
  const { reservationId } = useParams();

  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const onSubmit = async (e) => {
    const abortController = new AbortController();
    createTable(formData, abortController.signal)
      .then(loadDashboard)
      .then(() => history.push(`/dashboard`))
      .catch(setTableError);
  };

  useEffect(() => {
    if (method === "POST") return;

    const abortController = new AbortController();
    setTableError(null);

    getReservation(reservationId, abortController.signal)
      .then(setFormData)
      .catch(setTableError);

    return () => abortController.abort();
  }, [reservationId, method]);

  return (
    <div>
      <form style={{ width: "100%" }}>
        <label style={{ width: "100%" }} htmlFor="table_name">
          Table Name:
          <input
            className="form-control"
            id="table_name"
            type="text"
            name="table_name"
            placeholder="Table Name"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={formData?.table_name ?? ""}
            required={true}
          />
        </label>
        <label style={{ width: "100%" }} htmlFor="capacity">
          Number of People:
          <input
            className="form-control"
            id="capacity"
            type="number"
            min="2"
            name="capacity"
            placeholder="0"
            style={{ margin: "10px 0" }}
            onChange={handleChange}
            value={formData?.capacity ?? ""}
            required={true}
          />
        </label>
        <ErrorAlert error={tableError} />
      </form>

      <div className="row">
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
