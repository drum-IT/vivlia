const express = require('express');
const roomRouter = express.Router({ mergeParams: true });
const User = require('../models/user');
const middleware = require('../middleware');
const Booking = require('../models/booking');
const Room = require('../models/room');

// GET

roomRouter.get('/', middleware.isLoggedIn, (req, res) => {
	Room.find()
		.where('author')
		.equals(req.user._id)
		.exec((err, foundRooms) => {
			if (err) {
				req.flash('error', 'A database error has occurred.');
				res.redirect('back');
			} else {
				res.render('rooms/index', { foundRooms, page: 'rooms' });
			}
		});
});

roomRouter.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('rooms/new', { page: 'rooms' });
});

roomRouter.get(
	'/:room_id/edit',
	middleware.isLoggedIn,
	middleware.verifyRoomOwnership,
	(req, res) => {
		Room.findById(req.params.room_id, (err, foundRoom) => {
			if (err) {
				req.flash(
					'error',
					'There was a database error while retrieving the room.'
				);
				res.redirect('back');
			} else {
				res.render('rooms/edit', { foundRoom, page: 'rooms' });
			}
		});
	}
);

roomRouter.get(
	'/:room_id',
	middleware.isLoggedIn,
	middleware.verifyRoomOwnership,
	(req, res) => {
		Room.findById(req.params.room_id)
			.populate('bookings')
			.exec((err, foundRoom) => {
				if (err) {
					req.flash(
						'error',
						'A database error has occurred while getting the room.'
					);
					res.redirect('back');
				} else {
					console.log(foundRoom);
					res.render('rooms/show', { foundRoom, page: 'rooms' });
				}
			});
	}
);

// CREATE

roomRouter.post('/', middleware.isLoggedIn, (req, res) => {
	const newRoom = {
		name: req.body.name,
		author: req.user.id
	};
	Room.create(newRoom, (err, createdRoom) => {
		if (err) {
			req.flash('error', 'A database error has occurred.');
			res.redirect('back');
		} else {
			req.flash('success', 'Room Added');
			res.redirect('/rooms');
		}
	});
});

// UPDATE

roomRouter.put(
	'/:room_id',
	middleware.isLoggedIn,
	middleware.verifyRoomOwnership,
	(req, res) => {
		Room.findByIdAndUpdate(
			req.params.room_id,
			req.body,
			(err, updatedRoom) => {
				if (err) {
					req.flash(
						'error',
						'There was a database error while saving the room.'
					);
					res.redirect('back');
				} else {
					req.flash('success', 'Room Updated');
					res.redirect('/rooms/' + updatedRoom.id);
				}
			}
		);
	}
);

// DELETE

roomRouter.delete(
	'/:room_id',
	middleware.isLoggedIn,
	middleware.verifyRoomOwnership,
	(req, res) => {
		Room.findByIdAndRemove(req.params.room_id, err => {
			if (err) {
				req.flash(
					'error',
					'There was a database error while deleting the room.'
				);
				res.redirect('back');
			} else {
				req.flash('success', 'Room Deleted');
				res.redirect('/rooms');
			}
		});
	}
);

module.exports = roomRouter;
