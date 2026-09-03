const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);

  res.status(404);

  next(error);
};

const errorHandler = (err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);

  let statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  let message = err.message || "Internal Server Error";

  // ================================
  // MONGOOSE BAD OBJECT ID
  // ================================
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }

  // ================================
  // MONGOOSE VALIDATION ERROR
  // ================================
  if (err.name === "ValidationError") {
    statusCode = 400;

    const messages = Object.values(err.errors).map((error) => error.message);

    message = messages.join(", ");
  }

  // ================================
  // MONGOOSE DUPLICATE KEY ERROR
  // ================================
  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(err.keyValue || {})[0];

    message = `${field || "Field"} already exists`;
  }

  // ================================
  // MULTER FILE ERROR
  // ================================
  if (err.name === "MulterError") {
    statusCode = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size must be less than 5 MB";
    } else {
      message = err.message;
    }
  }

  // ================================
  // RESPONSE
  // ================================
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export { notFound, errorHandler };
