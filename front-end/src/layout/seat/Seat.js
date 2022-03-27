import React, {useState, useEffect} from 'react';
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../ErrorAlert";
import { readReservation, seatReservation, listTables } from "../../utils/api";

export default function Seat() {
    const initialState = { table_id: 0 };
    const [formData, setFormData] = useState(initialState);
    const [oneReservation, setOneReservation] = useState(initialState);
		const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);
    const {reservation_id} = useParams();
    const history = useHistory();

    useEffect(() => {
        const abortController = new AbortController();

        readReservation(reservation_id)
            .then(setOneReservation)
            .catch(setError);

        listTables()
            .then(setTables)
            .catch(setError);

        return abortController.abort();
    }, [reservation_id, setTables]);

    const handleSubmit =(e) => {
        e.preventDefault();

        const abortController = new AbortController();
        if (formData.table_id > 0) {
            seatReservation(reservation_id, formData.table_id)
                .then(() => history.push(`/dashboard?date=${oneReservation.reservation_date}`))
                .catch(setError)
        } else {
            setError({ message: "Not a valid table" })
        }

        return () => abortController.abort();
    };

    const handleChange = ({ target }) => {
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

		console.log(tables)

  const tableMenu = tables ? (
    tables.map((table) => {
      return (
        <option
          name={table.table_id}
          value={table.table_id}
          key={table.table_id}
        >
          {table.table_name} - {table.capacity}
        </option>
      );
    })
  ) : (
    <option defaultValue>No available tables</option>
  );

  return (
    <div>
      <h2>Seat Reservation</h2>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="form-label">
          Select Table:&nbsp;
        </label>

        <select className="form-select" name="table_id" onChange={handleChange}>
          <option defaultValue={0}>Please choose table:</option>
          {tableMenu}
        </select>

        <button className="btn btn-info" type="submit">
          Submit
        </button>

        <button
          className="btn btn-secondary"
          onClick={(e) => {
            e.preventDefault();
            history.goBack();
          }}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
