const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
	checkInDate: Date,
	checkInTime: Number,
	checkOutDate: Date,
	checkOutTime: Number,
	guestName: String,
	lengthOfStay: Number,
	numberOfGuests: Number,
	note: String,
	room: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Room"
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Booking", BookingSchema);
