import { Response } from "express";

/**
 * Creates an unauthorized response.
 */
export function createUnauthorizedResponse(
  response: Response,
  message?: string
) {
  return response
    .status(401)
    .json({ data: { message: message ?? "Unauthorized." } });
}

/**
 * Creates a database error response.
 */
export function createDatabaseErrorResponse(
  response: Response,
  message?: string
) {
  return response
    .status(500)
    .json({ data: { message: message ?? "Database failure" } });
}

export function createInternalServerErrorResponse(
  response: Response,
  statusCode?: number,
  message?: string
) {
  return response
    .status(statusCode ?? 500)
    .json({ message: message ?? "Internal server error." });
}

export function createOkResponse(response: Response, data?: unknown) {
  return response.status(200).json(data);
}
