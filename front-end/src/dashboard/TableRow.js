import React from "react";
import { finishTable } from '../utils/api';

export default function TableRow({ table }) {
    if (!table) return null;

    const handleFinish = (table_id) => {
        const abortController = new AbortController();
        let result = window.confirm('Is this table ready? /n You cannot undo this.');

        if (result) {
            finishTable(table_id, abortController.signal)
                .then(() => window.location.reload())
        }
        return () => abortController.abort();
    }

    return (
        <tr>
            <th scope="row">{table.table_id}</th>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td data-table-id-status={table.table_id}>{table.status}</td>
            <td>{table.reservation_id ? table.reservation_id : "--"}</td>
            {table.status === "occupied" && (
                <td>
                    <button
                    data-table-id-finish={table.table_id}
                    onClick={(e) => {
                        e.preventDefault();
                        handleFinish(table.table_id);
                    }}
                    type="button"
                    >
                        Finish
                    </button>
                </td>
            )}        
        
        </tr>
    );
}

