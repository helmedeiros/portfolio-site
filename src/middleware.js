// Security middleware to add proper HTTP headers
export async function onRequest(context, next) {
  // Only apply headers in production
  if (import.meta.env.PROD) {
    const response = await next();

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

    return response;
  }

  return next();
}
