import React, { useEffect, useMemo, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import { previous, next, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import TableRow from "./TableRow";
import ReservationRow from "./ReservationRow";
import './ReservationsAndTables.css'

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [date, setDate] = useState(today());

  const tablesBody = (hasOccupiedTables) => {
    return tables.map((table) => (
      <TableRow key={table.table_id} hasOccupiedTables={hasOccupiedTables} table={table} />
    ));
  };

  const reservationsBody = (hasBookedReservations) => {
    return reservations.map((reservation) => (
      <ReservationRow
        key={reservation.reservation_id}
				hasBookedReservations={hasBookedReservations}
        reservation={reservation}
      />
    ));
  };

  function handleClick({ target }) {
    let newDate;
    let theDate;

    if (!date) {
      theDate = today();
    } else {
      theDate = date;
    }

    if (target.name === "previous") {
      newDate = previous(theDate);
    } else if (target.name === "next") {
      newDate = next(theDate);
    } else {
      newDate = today();
    }

    setDate(newDate);
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController()
    setReservationsError(null)
    setTablesError(null)
    listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch((err) => setReservationsError(err))

    listTables({}, abortController.signal)
        .then(setTables)
        .catch((err) => setTablesError(err))
	}

	const hasBookedReservations = useMemo(() => reservations.some((res) => res.status === 'booked'), [reservations])
	const hasOccupiedTables = useMemo(() => tables.some((table) => table.status === 'occupied'), [tables])

	return (
    <main>
      <div
        className="container border rounded"
        style={{ alignItems: "center", width: "100%", padding: '20px 20px' }}
      >

      <div
        style={{ margin: "10px 0" }}
        className="h5 row border rounded bg-light"
      >

        <div className="breadcrumbContainer" style={{ margin: "15px" }}>
            <span className="oi oi-home" /> Dashboard
        </div>

      </div>

        <div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                style={{ width: "31%", marginRight: "5px" }}
                className="btn btn-info"
                type="button"
                name="previous"
                onClick={handleClick}
              >
                Previous
              </button>
              <button
                type="button"
                name="today"
                style={{ width: "31%", marginRight: "5px" }}
                className="btn btn-secondary"
                onClick={handleClick}
              >
                Today
              </button>
              <button
                style={{ width: "31%" }}
                className="btn btn-info"
                type="button"
                name="next"
                onClick={handleClick}
              >
                Next
              </button>
            </div>

            <div
              style={{ margin: "10px 0" }}
              className="h5 row border rounded bg-light"
            >
              <div className="breadcrumbContainer" style={{ margin: "15px" }}>
                <span/> Reservations for {date}
              </div>
            </div>

            <ErrorAlert error={reservationsError} />

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
              <tbody>{reservationsBody(hasBookedReservations)}</tbody>
            </table>

            <div
              style={{ margin: "10px 0" }}
              className="h5 row border rounded bg-light"
            >
              <div className="breadcrumbContainer" style={{ margin: "15px" }}>
                <span/> Tables for {date}
              </div>
            </div>

            <ErrorAlert error={tablesError} />

              <table>
                <thead>
                  <tr>
                    <th>Table ID</th>
                    <th>Table Name</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th>Reservation ID</th>
									{hasOccupiedTables ? <th>Action</th> : null}
                  </tr>
                </thead>
                <tbody>{tablesBody(hasOccupiedTables)}</tbody>
              </table>

          </div>
        </div>
      </div>
    </main>
  );
}

// The /dashboard page will
// list all reservations for one date only. (E.g. if the URL is /dashboard?date=2035-12-30 then send a GET to /reservations?date=2035-12-30 to list the reservations for that date). The date is defaulted to today, and the reservations are sorted by time.
// display next, previous, and today buttons that allow the user to see reservations on other dates
// display any error messages returned from the API
// display a list of all reservations in one area.
// each reservation in the list will:
// Display a "Seat" button on each reservation.
// The "Seat" button must be a link with an href attribute that equals /reservations/${reservation_id}/seat, so it can be found by the tests.
// display a list of all tables, sorted by table_name, in another area of the dashboard
// Each table will display "Free" or "Occupied" depending on whether a reservation is seated at the table.
// The "Free" or "Occupied" text must have a data-table-id-status=${table.table_id} attribute, so it can be found by the tests.
