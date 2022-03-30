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

  const params = new URLSearchParams(window.location.search);
  const [date, setDate] = useState(params.get('date') || today());
  


  // Returns table objects with the same id as the reservation
  const tablesBody = (hasOccupiedTables) => {
    return tables.map((table) => (
      <TableRow key={table.table_id} hasOccupiedTables={hasOccupiedTables} table={table} />
    ));
  };

  // Returns reservation objects for the proper ID
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

  // Loads the dashboard with objects for reservations and tables for the proper date 
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

  // Allows isolation of reservations with status "booked"
	const hasBookedReservations = useMemo(() => reservations.some((res) => res.status === 'booked'), [reservations])
	// Allows isolation of tables with status "occupied"
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
                  {/* If there is a reservation with status "booked" the action buttons will display */}
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
                  {/* If there is a table with status "occupied" the action buttons will display */}
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