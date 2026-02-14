const catchAsync = require('./../utils/catchAsyncError');
 const Ticket = require('./../models/ticketmodel'); 
 const AppError = require('./../utils/appError'); 
exports.getTicketIdByPrice = catchAsync(async (req, res, next) => {
  const ticketPrice = Number(req.body.ticketPrice);
  const ticket = await Ticket.findOne({ price: ticketPrice });
  if (!ticket) {
    return next(new AppError('Ticket Not Found', 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      ticketId: ticket._id
    }
  });
});