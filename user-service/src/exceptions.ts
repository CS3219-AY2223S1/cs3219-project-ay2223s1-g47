/**
 * Generic exception class used within the user service.
 */
export class UserServiceException extends Error {
  statusCode: number;

  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode ?? 500; // default as internal server error

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UserServiceException.prototype);
  }
}

export class UserDetailValidationException extends UserServiceException {
  constructor(message: string) {
    super(message, 400);
    Object.setPrototypeOf(this, UserDetailValidationException.prototype);
  }
}

/**
 * Exception thrown when creating/renaming an account clashes with an existing account
 */
 export class UsernameClashException extends UserServiceException {
  constructor(message: string) {
    super(message,409);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DbWriteException.prototype);
  }
}

/**
 * Exception thrown when deleting an account that does not exist
 */
 export class UserNotFoundException extends UserServiceException {
  constructor(message: string) {
    super(message,404);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DbWriteException.prototype);
  }
}



/**
 * Exception thrown when there is an error writing to the database.
 */
export class DbWriteException extends UserServiceException {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DbWriteException.prototype);
  }
}

/**
 * Exception thrown when there is an error reading from the database.
 */
export class DbReadException extends UserServiceException {
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
export class DbPermissionDeniedException extends UserServiceException {
  constructor(message: string) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DbPermissionDeniedException.prototype);
  }
}
