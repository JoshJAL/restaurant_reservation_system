import React from "react";
import { updateReservationStatus } from "../utils/api";

export default function ReservationRow({ reservation, hasBookedReservations }) {
  const {
    reservation_id,
    reservation_date,
    reservation_time,
    status,
    first_name,
    last_name,
    mobile_number,
    people,
  } = reservation;
  
  if (!reservation || status === "finished") return null;

  function handleClick() {
    if (window.confirm("Do you want to cancel this reservation?\nThis cannot be undone.")) {
      const abortController = new AbortController();

      updateReservationStatus(
        reservation_id,
        "cancelled",
        abortController.signal
      )
        .then(() => window.location.reload());

      return () => abortController.abort();
    }
  }

  return (
    <tr>
      <th scope="row">{reservation_id}</th>
      <td>{first_name}</td>
      <td>{last_name}</td>
      <td>{mobile_number}</td>
      <td>{reservation_date.substr(0, 10)}</td>
      <td>{reservation_time.substr(0, 5)}</td>
      <td>{people}</td>
      <td data-reservation-id-status={reservation_id}>
        {status}
      </td>

      {status === "booked" ? (
        <>
          <td>
            <a href={`/reservations/${reservation_id}/edit`}>
              <button className="btn btn-info" type="button">Edit</button>
            </a>
          </td>


          <td>
            <a href={`/reservations/${reservation_id}/seat`} className="btn btn-info">
              Seat
            </a>
          </td>

          <td>
            <button
							className="btn btn-secondary"
              type="button"
              onClick={handleClick}
              data-reservation-id-cancel={reservation_id}
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
