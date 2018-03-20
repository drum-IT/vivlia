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
	// reduce this to just the ID
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

module.exports = mongoose.model("Booking", BookingSchema);
