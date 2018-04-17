const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const middleware = require('../middleware');
const Booking = require('../models/booking');
const roomRouter = require('../routes/rooms');
const crypto = require('crypto');

userRouter.get('/:user_id', middleware.isLoggedIn, (req, res) => {
	if (req.user.id !== req.params.user_id) {
		req.flash('error', "You can't view another user's account.");
		res.redirect('back');
	} else {
		User.findById(req.params.user_id, (err, foundUser) => {
			if (err) {
				req.flash('error', 'User not found.');
				res.redirect('back');
			} else if (!foundUser) {
				req.flash('error', 'That user no longer exists.');
				res.redirect('back');
			} else {
				res.render('users/show', { foundUser, page: 'user' });
			}
		});
	}
});

userRouter.get('/:user_id/getNewKeys', middleware.isLoggedIn, (req, res) => {
	User.findById(req.user.id, (err, foundUser) => {
		if (err) {
			req.flash('error', 'error getting new api keys');
			res.redirect('/');
		} else {
			const keys = {
				key: keygen(),
				secret: keygen()
			};
			foundUser.apiKey = keys.key;
			foundUser.apiSecret = keys.secret;
			foundUser.save((err, savedUser) => {
				if (err) {
					req.flash('error', 'There was an error saving the user.');
					res.redirect('/');
				} else {
					res.redirect('/users/' + savedUser.id);
				}
			});
		}
	});
});

function keygen() {
	const key =
		(Math.random() + 1).toString(36).substring(2, 15) +
		(Math.random() + 1).toString(36).substring(2, 15) +
		(Math.random() + 1).toString(36).substring(2, 15);
	return key;
}

module.exports = userRouter;
