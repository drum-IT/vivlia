const express = require("express");
const bookingRouter = express.Router();
const Booking = require("../models/booking");

bookingRouter.get("/", (req, res) => {
	Booking.find({}, (err, foundBookings) => {
		if (err) {
			console.log("database error during GET all", err);
		} else {
			res.status(200).send({ foundBookings });
		}
	});
});

bookingRouter.post("/", (req, res) => {
	console.log(req.body);
	Booking.create(req.body, (err, newBooking) => {
		if (err) {
			console.log(err);
		} else {
			res.status(201).send({ newBooking });
		}
	});
});

module.exports = bookingRouter;