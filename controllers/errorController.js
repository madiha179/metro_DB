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

    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });

  } else {
    // MongoDB duplicate key
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      const value = err.keyValue[field];
      err.isOperational = true;
      return res.status(400).json({
        status: 'fail',
        message: `Duplicate field value: '${value}'. Please use another ${field}!`
      });
    }

    // CastError (invalid id)
    if (err.name === 'CastError') {
      err.isOperational = true;
      return res.status(400).json({
        status: 'fail',
        message: `Invalid ${err.path}: ${err.value}`
      });
    }

    // Validation error
    if (err.name === 'ValidationError') {
      err.isOperational = true;
      const errors = Object.values(err.errors).map(el => el.message);
      const message = `Invalid input data. ${errors.join('. ')}`;
      return res.status(400).json({
        status: 'fail',
        message
      });
    }

    // JWT invalid
    if (err.name === 'JsonWebTokenError') {
      err.isOperational = true;
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again.'
      });
    }

    // JWT expired
    if (err.name === 'TokenExpiredError') {
      err.isOperational = true;
      return res.status(401).json({
        status: 'fail',
        message: 'Your token has expired. Please log in again.'
      });
    }

    // Operational error (expected)
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    // Unknown error (programming bug)
    console.error('ERROR', err);
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};