const express = require("express");
const roomRouter = express.Router({ mergeParams: true });
const User = require("../models/user");
const middleware = require("../middleware");
const Booking = require("../models/booking");
const Room = require("../models/room");

roomRouter.get("/", middleware.isLoggedIn, (req, res) => {
	const user = {
		id: req.user.id,
		username: req.user.username
	};
	Room.find()
		.where("user.id")
		.equals(req.user._id)
		.exec((err, foundRooms) => {
			if (err) {
				req.flash("error", "A database error has occurred.");
				res.redirect("back");
			} else {
				res.render("rooms/index", { foundRooms });
			}
		});
});

roomRouter.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("rooms/new");
});

roomRouter.get("/:room_id", middleware.isLoggedIn, (req, res) => {
	Room.findById(req.params.room_id)
		.populate("bookings")
		.exec((err, foundRoom) => {
			if (err) {
				req.flash("error", "A database error has occurred while getting the room.");
				res.redirect("back");
			} else {
				console.log(foundRoom);
				res.render("rooms/show", { foundRoom });
			}
		});
});

roomRouter.post("/", middleware.isLoggedIn, (req, res) => {
	const newRoom = {
		name: req.body.name,
		user: {
			id: req.user.id,
			username: req.user.username
		}
	};
	Room.create(newRoom, (err, createdRoom) => {
		if (err) {
			req.flash("error", "A database error has occurred.");
			res.redirect("back");
		} else {
			res.redirect("/users/" + req.user.id + "/rooms");
		}
	});
});

module.exports = roomRouter;
