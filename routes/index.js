const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const Booking = require("../models/booking");

// GET ROUTES
router.get("/", (req, res) => {
	// eval(require("locus"));
	// const user = {
	// 	id: req.user.id,
	// 	username: req.user.username
	// }
	Booking.find({}, (err, foundBookings) => {
		if (err) {
			req.flash("error", "there was an error getting all bookings");
			res.redirect("back");
		} else {
			res.render("landing", { foundBookings });
		}
	});
});

// show the register form
router.get("/register", (req, res) => {
	res.render("register", { page: "register" });
});

// show the login form
router.get("/login", (req, res) => {
	res.render("login", { page: "login" });
});

// show the logout form
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have been logged out.");
	res.redirect("/");
});

// POST ROUTES
// create a new user, add them to the database, and authenticate them
router.post("/register", (req, res) => {
	const user = new User({
		username: req.body.username
	});
	User.register(user, req.body.password, (err, newUser) => {
		if (err) {
			req.flash("error", err.message);
			return res.redirect("register");
		}
		passport.authenticate("local")(req, res, () => {
			req.flash(
				"success",
				`You have successfully signed up, ${newUser.username}!`
			);
			res.redirect("/");
		});
	});
});

// log a user in
router.post(
	"/login",
	passport.authenticate("local", {
		failureRedirect: "/login",
		failureFlash: true
	}),
	(req, res) => {
		req.flash("success", `Welcome back, ${req.user.username}!`);
		res.redirect("/");
	}
);

module.exports = router;
