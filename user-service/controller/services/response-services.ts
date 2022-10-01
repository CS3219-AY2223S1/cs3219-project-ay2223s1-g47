import { Response } from "express";

/**
 * Creates an unauthorized response.
 */
export function createUnauthorizedResponse(
  response: Response,
  message?: string
) {
  return response.status(401).json({ message: message ?? "Unauthorized." });
}

/**
 * Creates a database error response.
 */
export function createDatabaseErrorResponse(
  response: Response,
  message?: string
) {
  return response.status(500).json({ message: message ?? "Database failure" });
}

export function createInternalServerErrorResponse(
  response: Response,
  statusCode: number,
  message?: string
) {
  return response
    .status(statusCode ?? 500)
    .json({ message: message ?? "Internal server error." });
}
