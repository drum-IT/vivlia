const express = require('express');
const Booking = require('../models/booking');
const User = require('../models/user');
const middleware = require('../middleware');
const Room = require('../models/room');

const bookingRouter = express.Router();

bookingRouter.get('/', (req, res) => {
  Booking.find({}, (err, foundBookings) => {
    if (err) {
      return console.log('database error during GET all', err);
    }
    res.render('bookings/index', { foundBookings, page: 'bookings' });
  });
});

bookingRouter.get('/:booking_id', (req, res) => {
  Booking.findById(req.params.booking_id)
    .populate('room')
    .exec((err, foundBooking) => {
      if (err) {
        return res.send({ message: 'error, no booking found' });
      }
      return res.send({ booking: foundBooking });
    });
});

bookingRouter.post('/', middleware.checkAPIKeys, (req, res) => {
  const newBooking = req.body;
  const user = {
    apiKey: req.headers.apikey,
    apiSecret: req.headers.apisecret,
  };
  User.findOne(user, (userErr, foundUser) => {
    if (userErr || !foundUser) {
      return res.send({ success: false, message: 'no user found' });
    }
    newBooking.user = foundUser.id;
    Booking.create(newBooking, (bookingErr, createdBooking) => {
      if (bookingErr) {
        console.log(bookingErr);
      } else {
        Room.findById(createdBooking.room, (roomErr, foundRoom) => {
          if (roomErr) {
            console.log(roomErr);
          } else {
            foundRoom.bookings.push(createdBooking.id);
            foundRoom.save();
            res.status(201).send({
              success: true,
              message: 'booking created!',
              createdBooking,
            });
          }
        });
      }
    });
  });
});

module.exports = bookingRouter;
