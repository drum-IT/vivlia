const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	bookings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Booking"
		}
	],
	name: String
});

module.exports = mongoose.model("Room", RoomSchema);
