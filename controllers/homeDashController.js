const stationsLocation = require('../models/stationsLocation');
const catchAsyncError = require('../utils/catchAsyncError');
const UserTripsModel=require('../models/usersTripes');
const Subscription=require('../models/subscriptionModel');
const appError=require('../utils/appError');
exports.getAllLocations=catchAsyncError(async(req,res)=>{
const StationLocations=await stationsLocation.find({},{
  '_id':0,
  'name.en':1,
  'location':1,
  'line':1
}).sort({ 'line': 1, 'location.coordinates.1': 1 });
const formatted=StationLocations.map(station=>({
  name:station.name.en,
  line:station.line,
  lat:station.location.coordinates[1],
  lng:station.location.coordinates[0]
}));
res.status(200).json({
  success:true,
  count:formatted.length,
  data:formatted
});
});
exports.getTicketAnalysis = catchAsyncError(async (req, res, next) => {
  const result = await UserTripsModel.aggregate([

    { $unwind: '$trip_history' },
    { $match: { 'trip_history.ticketId': { $exists: true, $ne: null } } },

    {
      $group: {
        _id: '$trip_history.ticketId',  
        count: { $sum: 1 },
      },
    },

    {
      $lookup: {
        from: 'tickets',
        localField: '_id',
        foreignField: '_id',
        as: 'ticketInfo',
      },
    },
    { $unwind: { path: '$ticketInfo', preserveNullAndEmptyArrays: true } },

    {
      $group: {
        _id: null,
        tickets: {
          $push: {
            color: '$ticketInfo.colors',
            count: '$count',
            price: '$ticketInfo.price',
            no_of_stations: '$ticketInfo.no_of_stations',
          },
        },
        total: { $sum: '$count' },
      },
    },

    {
      $project: {
        _id: 0,
        total: 1,
        tickets: {
          $map: {
            input: '$tickets',
            as: 'ticket',
            in: {
              color: '$$ticket.color',
              price: '$$ticket.price',
              no_of_stations: '$$ticket.no_of_stations',
              count: '$$ticket.count',
              percentage: {
                $round: [
                  { $multiply: [{ $divide: ['$$ticket.count', '$total'] }, 100] },
                  2,
                ],
              },
            },
          },
        },
      },
    },
  ]);

  const data = result[0] || { total: 0, tickets: [] };
  res.status(200).json({
    status: 'success',
    total_trips: data.total,
    data: data.tickets,
  });
});
exports.getSubscriptionAnalysis=catchAsyncError(async(req,res,next)=>{
   const result = await Subscription.aggregate([
      {
        $lookup: {
          from: 'subscriptiontypes',
          localField: 'type',
          foreignField: '_id',
          as: 'typeInfo',
        },
      },
      { $unwind: { path: '$typeInfo', preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: {
            category_en: '$typeInfo.category.en',
          },
          count: { $sum: 1 },
        },
      },

      {
        $group: {
          _id: null,
          categories: {
            $push: {
              category_en: '$_id.category_en',
              count: '$count',
            },
          },
          total: { $sum: '$count' },
        },
      },

      {
        $project: {
          _id: 0,
          total: 1,
          categories: {
            $map: {
              input: '$categories',
              as: 'cat',
              in: {
                category: {
                  en: '$$cat.category_en',
                },
                count: '$$cat.count',
                percentage: {
                  $round: [
                    {
                      $multiply: [
                        { $divide: ['$$cat.count', '$total'] },
                        100,
                      ],
                    },
                    2,
                  ],
                },
              },
            },
          },
        },
      },
    ]);
    const data=result[0]||{total:0,categories:[]};
     res.status(200).json({
      status: 'success',
      total_subscriptions: data.total,
      data: data.categories,
    });
});