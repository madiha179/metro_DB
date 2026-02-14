const catchAsync = require('./../utils/catchAsyncError');
 const Ticket = require('./../models/ticketmodel'); 
 const UserTrips = require('./../models/usersTripes'); 
 const AppError = require('./../utils/appError'); 
exports.getTicketIdByPrice = catchAsync(async (req, res, next) => {
  const ticketPrice = Number(req.body.ticketPrice);
  const numberOfTickets = Number(req.body.numberOfTickets);
  const ticket = await Ticket.findOne({ price: ticketPrice });
  if (!ticket) {
    return next(new AppError('Ticket Not Found', 400));
  }
  const totalPrice = ticketPrice * numberOfTickets;
  const userTrip = await UserTrips.create({
    userId: req.user.id,
    ticketId: ticket._id,
    totalPrice
  });
  res.status(200).json({
    status: "success",
    data: {
      ticketId: ticket._id,
      totalPrice
    }
  });
});