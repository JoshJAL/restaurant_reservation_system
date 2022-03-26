const read = require("body-parser/lib/read");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

// Handlers for tables resources

async function list(req, res) {
  const result = await service.list();

  res.json({ data: result });
}

async function create(req, res) {
  if (req.body.reservation_id) {
    req.body.status = "occupied";
    await service.update(req.body.reservation_id, "seated");
  } else {
    req.body.status = "free";
  }

  const result = await service.create(req.body);

  res.status(201).json({ data: result[0] });
}

async function update(req, res) {
  await service.occupy(
    res.locals.tables.table_id,
    res.locals.reservation.reservation_id
  );
  await service.update(res.locals.reservation.reservation_id, "seated");

  res.status(200).json({ data: { status: "seated" } });
}

async function destroy(req, res, next) {
  await service.update(res.locals.table.reservation_id, "finished");

  await service.free(res.locals.table.table_id);

  res.status(200).json({ data: { status: "finished" } });
}

// Validators for tables resources

async function validateTableData(req, res, next) {
  if (!req.body) {
    return next({
      status: 400,
      message: "Body must include data.",
    });
  }
  next();
}

async function validateTableBody(req, res, next) {
  if (!req.body.table_name || req.body.table_name === "") {
    return next({ status: 400, message: "'table_name' cannot be empty." });
  }

  if (req.body.table_name.length < 2) {
    return next({
      status: 400,
      message: `'table_name' must be at least 2 characters long.`,
    });
  }

  if (!req.body.capacity || req.body.capacity === "") {
    return next({ status: 400, message: "'capacity' cannot be empty." });
  }

  if (typeof req.body.capacity !== "number") {
    return next({ status: 400, message: "'capacity' must be a number." });
  }

  if (req.body.capacity < 1) {
    return next({ status: 400, message: "'capacity' must be at least 1." });
  }

  next();
}

async function validateReservationId(req, res, next) {
  const { reservation_id } = req.body;

  if (!reservation_id) {
    return next({
      status: 400,
      message: `reservation_id must be included in the body.`,
    });
  }

  const reservation = await service.readReservation(Number(reservation_id));

  if (!reservation) {
    return next({
      status: 404,
      message: `reservation_id: ${reservation_id} does not exist.`,
    });
  }

  res.locals.reservation = reservation;

  next();
}

async function validateTableId(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (!table) {
    return next({
      status: 404,
      message: `table_id: ${table_id} does not exist`,
    });
  }

  res.locals.table = table;
  next();
}

async function validateOccupiedTable(req, res, next) {
  if (res.locals.table.status !== "occupied") {
    return next({ status: 400, message: `This table is not occupied.` });
  }

  next();
}

async function validateSeat(req, res, next) {
  if (res.locals.table.status === "occupied") {
    return next({
      status: 400,
      message: `The table you selected is occupied.`,
    });
  }

  if (res.locals.reservation.status === "seated") {
    return next({
      status: 400,
      message: `The reservation you selected is already seated.`,
    });
  }

  if (res.locals.table.capacity < res.locals.reservation.people) {
    return next({
      status: 400,
      message: `The table you selected does not have the capacity to seat ${res.locals.reservation.people} people.`,
    });
  }

  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateTableData),
    asyncErrorBoundary(validateTableBody),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(validateTableData),
    asyncErrorBoundary(validateTableId),
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateSeat),
    asyncErrorBoundary(update),
  ],
  destroy: [
    asyncErrorBoundary(validateTableId),
    asyncErrorBoundary(validateOccupiedTable),
    asyncErrorBoundary(destroy),
  ],
};
