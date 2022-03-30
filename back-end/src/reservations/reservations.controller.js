const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * Handlers for reservation resources
 */
async function list(req, res) {
  const date = req.query.date;
  const mobile_number = req.query.mobile_number;
  const reservations = await service.list(date, mobile_number);
  const result = reservations.filter(
    (reservation) => reservation.status !== "finished"
  );
  res.json({ data: result });
}

async function create(req, res) {
  req.body.data.status = "booked";
  const result = await service.create(req.body.data);
  res.status(201).json({ data: result[0] });
}

async function read(req, res) {
  res.status(200).json({ data: res.locals.reservation });
}

async function update(req, res) {
  await service.update(res.locals.reservation.reservation_id, req.body.data.status);

  res.status(200).json({ data: { status: req.body.data.status } });
}

async function edit(req, res) {
  const result = await service.edit(
    res.locals.reservation.reservation_id,
    req.body.data
  );
  res.status(200).json({ data: result[0] });
}

// Validators

async function validateReservationId(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(Number(reservation_id));

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation id ${reservation_id} does not exist.`,
  });
}

async function validateReservationData(req, res, next) {
  console.log(req.body.data);
  if (!req.body.data) {
    return next({
      status: 400,
      message: `Body must include data.`,
    });
  }
  next();
}

async function validateReservationBody(req, res, next) {
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  for (let field of requiredFields) {
    if (!req.body.data.hasOwnProperty(field) || req.body.data[field] === "") {
      return next({
        status: 400,
        message: `Field required: ${field}.`,
      });
    }
  }

  if (
    Number.isNaN(
      Date.parse(`${req.body.data.reservation_date} ${req.body.data.reservation_time}`)
    )
  ) {
    return next({
      status: 400,
      message: `"reservation_date" or "reservation_time" is filled out incorrectly.`,
    });
  }

  if (typeof req.body.data.people !== "number") {
    return next({
      status: 400,
      message: `"people" must be a number.`,
    });
  }

  if (req.body.data.people < 1) {
    return next({
      status: 400,
      message: `"people" field must be 1 or greater`,
    });
  }

  if (req.body.data.status && req.body.data.status !== "booked") {
    return next({
      status: 400,
      message: `"status" field cannot be ${req.body.data.status}`,
    });
  }
  next();
}

async function validateReservationDate(req, res, next) {



  const reservationDate = new Date(
    `${req.body.data.reservation_date}T${req.body.data.reservation_time}:00.000`
  );
  const todaysDate = new Date();

  if (reservationDate.getDay() === 2) {
    return next({
      status: 400,
      message: `"reservation_date" field: restaurant is closed on Tuesday.`,
    });
  }

  if (reservationDate < todaysDate) {
    return next({
      status: 400,
      message: `"reservation_date" must be in the future.`,
    });
  }

  if (
    reservationDate.getHours() < 10 ||
    (reservationDate.getHours() === 10 && reservationDate.getMinutes() < 30)
  ) {
    return next({
      status: 400,
      message: `reservation_time: ${req.body.data.reservation_time}; restaurant is not open until 10:30 AM.`,
    });
  }

  if (
    reservationDate.getHours() > 22 ||
    (reservationDate.getHours() === 22 && reservationDate.getMinutes() >= 30)
  ) {
    return next({
      status: 400,
      message: `reservation_time: ${req.body.data.reservation_time}; restaurant closes after 10:30 PM.`,
    });
  }

  if (
    reservationDate.getHours() > 21 ||
    (reservationDate.getHours() === 22 && reservationDate.getMinutes() >= 30)
  ) {
    return next({
      status: 400,
      message: `reservation_time: ${req.body.data.reservation_time}; reservation must be made at least an hour before close (10:30 PM).`,
    });
  }

  console.log('Here!!!!! <---------->')

  next();
}

async function validateUpdate(req, res, next) {
  if (!req.body.data.status) {
    return next({
      status: 400,
      message: `Body must include a status field.`,
    });
  }

  if (
    req.body.data.status !== "booked" &&
    req.body.data.status !== "seated" &&
    req.body.data.status !== "finished" &&
    req.body.data.status !== "cancelled"
    ) {
  return next({
      status: 400,
      message: `"Status" field cannot be ${req.body.data.status}.`,
    });
  }

  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: `A finished reservation cannot be updated.`,
    });
  }

  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(validateReservationData),
    asyncErrorBoundary(validateReservationBody),
    asyncErrorBoundary(validateReservationDate),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(validateReservationData),
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateUpdate),
    asyncErrorBoundary(update),
  ],
  edit: [
    asyncErrorBoundary(validateReservationData),
    asyncErrorBoundary(validateReservationId),
    asyncErrorBoundary(validateReservationBody),
    asyncErrorBoundary(validateReservationDate),
    asyncErrorBoundary(edit),
  ],
  read: [asyncErrorBoundary(validateReservationId), asyncErrorBoundary(read)],
};
