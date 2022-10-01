/**
 * Generic exception class used within the user service.
 */
class UserServiceException extends Error {
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode ?? 500; // default as internal server error

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UserServiceException.prototype);
  }
}

/**
 * Exception thrown when there is an error writing to the database.
 */
class DbWriteException extends UserServiceException {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DbWriteException.prototype);
  }
}

/**
 * Exception thrown when there is an error reading from the database.
 */
class DbReadException extends UserServiceException {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DbReadException.prototype);
  }
}

/**
 * Exception thrown when there is an illegal access to the db. (e.g. a user trying to
 * delete another user's account)
 */
class DbPermissionDeniedException extends UserServiceException {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DbPermissionDeniedException.prototype);
  }
}
