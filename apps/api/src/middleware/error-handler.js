export function notFoundHandler(_req, res) {
  res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Route not found' } });
}

export function errorHandler(error, _req, res, _next) {
  const status = Number(error.status) || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({
    error: {
      code: error.code || 'INTERNAL_SERVER_ERROR',
      message: status >= 500 ? error.status === 503 ? error.message : 'An unexpected error occurred' : error.message,
      ...(error.details ? { details: error.details } : {}),
    },
  });
}
