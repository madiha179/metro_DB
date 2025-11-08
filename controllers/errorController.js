const AppError = require('./../utils/appError');
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  console.log('Error Details:', {
    name: err.name,
    code: err.code,
    message: err.message,
    keyValue: err.keyValue
  });

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      return res.status(400).json({
        status: 'fail',
        message: `Duplicate field value: '${value}'. Please use another ${field}!`
      });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid ${err.path}: ${err.value}`
      });
    }

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      const message = `Invalid input data. ${errors.join('. ')}`;
      return res.status(400).json({
        status: 'fail',
        message: message
      });
    }
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      console.error('ERROR', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
      });
    }
  }
};