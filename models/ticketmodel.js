const mongoose = require('mongoose');
ticketSchema = new mongoose.Schema({
    price:{
        type: Number,
        require: [true, 'Please provided price']
    },
    no_of_stations:{
        type: Number,
        require: [true, 'Please provided the number of station']
    }
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
