const catchAsync = require('./../utils/catchAsyncError');
const Ticket = require('./../models/ticketmodel');
const AppError = require('./../utils/appError');
exports.getTicketIdByPrice = catchAsync(async (req, res, next) => {
  const ticketPrice = req.body.ticketPrice;
  const numberOfTickets = req.body.numberOfTickets;
  const ticket = await Ticket.findOne({ price: ticketPrice });
  if (!ticket) {
    return next(new AppError('Ticket Not Found', 400));
  }
  const updatedTicket = await Ticket.findByIdAndUpdate(
    ticket._id,
    { totalPrice: ticketPrice * numberOfTickets },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      ticketId: ticket._id,
    }
  });
});