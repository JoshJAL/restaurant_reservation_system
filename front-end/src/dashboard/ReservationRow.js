import React from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

export default function ReservationRow({ reservation, hasBookedReservations }) {
  if (!reservation || reservation.status === "finished") return null;

  function handleClick() {
    if (window.confirm("Are you sure you want to cancel?")) {
      const abortController = new AbortController();

      updateReservationStatus(
        reservation.reservation_id,
        "cancelled",
        abortController.status
      )
        .then(() => window.location.reload());

      return () => abortController.abort();
    }
  }

  return (
    <tr>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date.substr(0, 10)}</td>
      <td>{reservation.reservation_time.substr(0, 5)}</td>
      <td>{reservation.people}</td>
      <td data-reservation-id-status={reservation.reservation_id}>
        {reservation.status}
      </td>

      {reservation.status === "booked" ? (
        <>
          <td>
            <Link to={`/reservations/${reservation.reservation_id}/edit`}>
              <button className="btn btn-info" type="button">Edit</button>
            </Link>
          </td>


          <td>
            <a href={`/reservations/${reservation.reservation_id}/seat`}>
              <button className="btn btn-info" type="button">Seat</button>
            </a>
          </td>

          <td>
            <button
							className="btn btn-secondary"
              type="button"
              onClick={handleClick}
              data-reservation-id-cancel={reservation.reservation_id}
            >
              Cancel
            </button>
          </td>
        </>
      ) : hasBookedReservations ?
				new Array(3).fill(<td />).map(x => x)
				: null
			}
    </tr>
  );
}
