const Ticket=require('./../models/ticketmodel');
const catchAsync=require('./../utils/catchAsyncError');
const AppError=require('./../utils/appError');
exports.getAllTickets=catchAsync(async(req,res,next)=>{
const ticket =await Ticket.find().select('price no_of_stations');
if(!ticket) return next(new AppError('tickets not found'));
res.status(200).json({
  success:true,
  data:ticket
})
});