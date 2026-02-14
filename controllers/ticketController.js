const catchAsync = require('./../utils/catchAsyncError');
const Ticket = require('./../models/ticketmodel');
const UserTrips = require('./../models/usersTripes');
const AppError = require('./../utils/appError');
exports.getTicketIdByPrice = catchAsync(async (req, res, next) => {
  const ticketPrice = req.body.ticketPrice;
  const numberOfTickets = req.body.numberOfTickets;
  const userId = await UserTrips.findById(req.user.id);
  const ticket = await Ticket.findOne({ price: ticketPrice });
  if (!ticket) {
    return next(new AppError('Ticket Not Found', 400));
  }
  const totalPrice = ticketPrice * numberOfTickets;
  const userTrip = await UserTrips.create({
    userId,
    ticketId: ticket._id,
    totalPrice
  });
  res.status(200).json({
    status: "success",
    data: {
      ticketId: ticket._id
    }
  });
});