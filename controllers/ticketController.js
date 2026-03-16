const catchAsync = require('./../utils/catchAsyncError');
 const Ticket = require('./../models/ticketmodel'); 
 const UserTrips = require('./../models/usersTripes'); 
 const AppError = require('./../utils/appError'); 
 const getLang=require('../utils/getLang');
exports.getTicketIdByPrice = catchAsync(async (req, res, next) => {
  const { ticketPrice, numberOfTickets, tripId } = req.body; 
  const ticket = await Ticket.findOne({ price: Number(ticketPrice) });
  if (!ticket) return next(new AppError('Ticket Not Found', 400));
  const totalPrice = Number(ticketPrice) * Number(numberOfTickets);
  await UserTrips.findByIdAndUpdate(tripId, {
    $set: {
      'trip_history.0.ticketId':   ticket._id,
      'trip_history.0.totalPrice': totalPrice
    }
  });

  res.status(200).json({
    status: 'success',
    data: {
      tripId,
      ticketId:  ticket._id,
      totalPrice
    }
  });
});