const express = require("express");
const bookingRouter = express.Router();
const Booking = require("../models/booking");
const User = require("../models/user");
const middleware = require("../middleware");

bookingRouter.get("/", (req, res) => {
	Booking.find({}, (err, foundBookings) => {
		if (err) {
			console.log("database error during GET all", err);
		} else {
			res.status(200).send({ foundBookings });
		}
	});
});

bookingRouter.get("/:booking_id", (req, res) => {
	Booking.findById(req.params.booking_id, (err, foundBooking) => {
		if (err) {
			res.send({ message: "error, no booking found"});
		} else {
			res.send({ booking: foundBooking });
		}
	})
});

bookingRouter.post("/", middleware.checkAPIKeys, (req, res) => {
	console.log(req.headers);
	console.log(req.body);
	const newBooking = req.body;
	const user = {
		apiKey: req.headers.apikey,
		apiSecret: req.headers.apisecret
	};
	User.findOne(user, (err, foundUser) => {
		if (err || !foundUser) {
			return res.send({ success: false, message: "no user found" });
		} else {
			newBooking.user = {
				id: foundUser.id,
				username: foundUser.username
			};
			Booking.create(newBooking, (err, createdBooking) => {
				if (err) {
					console.log(err);
				} else {
					res.status(201).send({ success: true, message: "booking created!", createdBooking });
				}
			});
		}
	});
});

module.exports = bookingRouter;
