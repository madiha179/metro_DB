module.exports = (err, req, res, next) => {
  err.codestatus = err.codestatus || 500;
  err.status = err.status || 'error';

  res.status(err.codestatus).json({
    status: err.status,
    message: err.message
  });
};