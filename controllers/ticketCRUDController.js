const Ticket=require('./../models/ticketmodel');
const catchAsyncError=require('./../utils/catchAsyncError');
const appError=require('./../utils/appError');

exports.getAllTickets=catchAsyncError(async(req,res,next)=>{
  const allTickets=await Ticket.find();
  if(allTickets.length === 0)
    return next (new appError('There is no Tickets To Show',404));
  res.status(200).json({
    status:'success',
    results:allTickets.length,
    data:allTickets
  })
});

exports.getTicketById=catchAsyncError(async(req,res,next)=>{
  const ticket=await Ticket.findById(req.params.id);
  if(!ticket)
    return next (new appError('Ticket Not Found',404));
  res.status(200).json({
    status:'success',
    data:ticket
  })
});

exports.addTicket=catchAsyncError(async(req,res,next)=>{
  const {ticketPrice,noOfStations}=req.body;
  const newTicket=await Ticket.create({price:ticketPrice,no_of_stations:noOfStations});
  res.status(201).json({
    status:'success',
    data:{
      ticket:newTicket
    }
  })
});

exports.updateTicket=catchAsyncError(async(req,res,next)=>{
  const ticket=await Ticket.findByIdAndUpdate(req.params.id,req.body,{
    new:true
  });
  if(!ticket)
    return next(new appError('Ticket Not Found',404));
  res.status(200).json({
    status:'success',
    data:{
      ticket
    }
  })
});

exports.deleteTicket=catchAsyncError(async(req,res,next)=>{
  const ticket=await findByIdAndDelete(req.params.id);
  if(!ticket)
    return next(new appError('Ticket Not Found',404));
  res.status(200).json({
    status:'success'
  })
});