import React, {useState, useEffect} from 'react';
import { useHistory, useParams, Link } from "react-router-dom";
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

  // shows all available tables
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
          <span className="text-secondary">Seat Table</span>
        </div>
      </div>

      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label className="form-label" htmlFor="form-label">
          Select Table:&nbsp;
        </label>

        <br />

        <select className="form-select" name="table_id" onChange={handleChange} style={{ marginBottom: '12px'}}>
          <option defaultValue={0}>Please choose table:</option>
          {tableMenu}
        </select>

        <br />

        <button className="btn btn-info" type="submit" style={{ marginRight: '10px' }}>
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
