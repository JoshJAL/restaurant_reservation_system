const knex = require('../db/connection');

function create(table) {
    return knex("tables")
        .insert(table)
        .returning("*");
}

function read(table_id) {
    return knex("tables")
        .select("*")
        .where({ table_id })
        .first();
}

function update(reservation_id, status) {
    return knex("reservations")
        .where({ reservation_id: reservation_id })
        .update({ status: status });
}

function list(reservation_ids) {
		if (reservation_ids) {
			return knex("tables")
				.select("*")
				.whereIn("reservation_id", reservation_ids);
		}

		return knex("tables")
				.select("*");
}

function readReservation(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: reservation_id })
        .first();
}

function occupy(table_id, reservation_id) {
    return knex("tables")
        .where({ table_id })
        .update({ reservation_id: reservation_id, status: "occupied" })
}

function free(table_id) {
    return knex("tables")
        .where({ table_id })
        .update({ reservation_id: null, status: "free" });
}

module.exports = {
    list,
    create,
    read,
    occupy,
    free,
    readReservation,
    update,
}
