const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	bookings: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Booking'
		}
	],
	name: String,
	notes: String
});

module.exports = mongoose.model('Room', RoomSchema);
