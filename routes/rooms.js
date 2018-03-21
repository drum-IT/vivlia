const express = require("express");
const roomRouter = express.Router({ mergeParams: true });
const User = require("../models/user");
const middleware = require("../middleware");
const Booking = require("../models/booking");
const Room = require("../models/room");

roomRouter.get("/", middleware.isLoggedIn, (req, res) => {
	Room.find()
		.where("user")
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

roomRouter.get("/:room_id/edit", middleware.isLoggedIn, (req, res) => {
	Room.findById(req.params.room_id, (err, foundRoom) => {
		if (err) {
			req.flash("error", "There was a database error while retrieving the room.");
			res.redirect("back");
		} else {
			res.render("rooms/edit", { foundRoom });
		}
	});
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
		user: req.user.id
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

roomRouter.put("/:room_id", (req, res) => {
	Room.findByIdAndUpdate(req.params.room_id, req.body, (err, updatedRoom) => {
		if (err) {
			req.flash("error", "There was a database error while saving the room.");
      res.redirect("back");
		} else {
			req.flash("success", "Room updated!");
			res.redirect("/users/" + req.user.id + "/rooms/" + updatedRoom.id);
		}
	})
});

roomRouter.delete("/:room_id", middleware.isLoggedIn, (req, res) => {
	Room.findByIdAndRemove(req.params.room_id, (err) => {
		if (err) {
			req.flash("error", "There was a database error while deleting the room.");
			res.redirect("back");
		} else {
			req.flash("success", "Room deleted!");
			res.redirect("/users/" + req.user.id + "/rooms");
		}
	})
});

module.exports = roomRouter;
