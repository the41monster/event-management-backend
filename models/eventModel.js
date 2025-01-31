const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String, required: true },
    participants: [{ partipantName: String, email: String }]
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;