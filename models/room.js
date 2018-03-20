const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
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
