const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let details = process.env.NODE_ENV === 'development' ? err.message : undefined;

  // Handle specific error types
  if (err.message === 'Invalid credentials') {
    statusCode = 401;
    message = 'Invalid email or password';
  } else if (err.message === 'User already exists') {
    statusCode = 409;
    message = 'User with this email already exists';
  } else if (err.message === 'User not found') {
    statusCode = 404;
    message = 'User not found';
  } else if (err.message.includes('Invalid token')) {
    statusCode = 401;
    message = 'Invalid or expired token';
  } else if (err.message === 'EI assessment requires exactly 16 answers') {
    statusCode = 400;
    message = err.message;
  } else if (err.message === 'Invalid tool ID') {
    statusCode = 400;
    message = err.message;
  } else if (err.message === 'Mood values must be between 0 and 10') {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    error: {
      message,
      ...(details && { details }),
    },
  });
};

module.exports = errorHandler;
