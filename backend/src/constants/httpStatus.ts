/**
 * Standard HTTP Status Codes used throughout the application.
 * Centralizing these avoids magic numbers and improves readability.
 */
export const HttpStatusCode = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
