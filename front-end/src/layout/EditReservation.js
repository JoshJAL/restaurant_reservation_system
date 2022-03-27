import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import ReservationForm from "./reservationForm";
import { readReservation, updateReservation } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

const initialFormState = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "",
  people: "",
};

export default function EditReservation() {
  const history = useHistory();
	const { reservation_id } = useParams();
  const [formData, setFormData] = useState({ ...initialFormState });
	const [error, setError] = useState(null);

	useEffect(() => {
		if (reservation_id) {
			readReservation(reservation_id)
					.then(setFormData)
					.catch(setError);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

  const handleChange = ({ target }) => {
    setFormData({
      ...formData,
      [target.name]: target.value,
    });
  };

  const onSubmit = async (e) => {
    const abortController = new AbortController();
    console.log(formData);
    const reservation = await updateReservation(
      { ...formData, people: Number(formData.people) },
      abortController.signal
    );
    history.push(`/dashboard/${reservation.reservation_id}`);
  };

  return (
    <div className="container">
      <ErrorAlert error={error} />
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
          <span className="text-secondary">Edit Reservation</span>
        </div>
      </div>

      <ReservationForm
        method={"PUT"}
        handleChange={handleChange}
        formData={formData}
        onSubmit={onSubmit}
      />
    </div>
  );
}
