const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
	checkInDate: Date,
	checkInTime: Number,
	checkOutDate: Date,
	checkOutTime: Number,
	guestName: String,
	lengthOfStay: Number
});

module.exports = mongoose.model("Booking", BookingSchema);
