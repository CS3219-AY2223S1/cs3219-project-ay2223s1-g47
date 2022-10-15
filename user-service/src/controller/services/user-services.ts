import { randomUUID, sign } from "crypto";
import {
  DbPermissionDeniedException,
  DbReadException,
  DbWriteException,
  UserDetailValidationException,
  UserServiceException,
} from "../../exceptions";
import { LoginDetails, SignUpDetails } from "../../interfaces/login-details";
import { User } from "../../interfaces/user";
import UserModel from "../../models/user-model";

/**
 * Creates and saves the user in db, and returns a backend interface of the user.
 */
export async function createUser(signupDetails: SignUpDetails) {
  // 1. check if user exists
  const username = signupDetails.username;
  if (await userWithUsernameExists(username)) {
    throw new DbWriteException("User already exists.");
  }

  // 2. if user does not exist, we create and save the uservalidate the change
  validateSignupDetails(signupDetails);
  try {
    const userModel = await new UserModel({
      username: signupDetails.username,
      password: signupDetails.password,
      id: randomUUID(),
    }).save();

    // 3. then we return the user as an interface
    const user: User = {
      username: userModel.username,
      password: userModel.password,
      id: userModel.id,
    };
    return user;
  } catch (error) {
    console.error(error);
    throw new DbWriteException("Error creating user!");
  }
}

/**
 * Modifies the entry in DB
 */
export async function modifyUser(id: string, signupDetails: SignUpDetails) {
  try {
    // 1. check if user exists
    if (!(await userWithIdExists(id))) {
      throw new DbReadException("User does not exist.");
    }

    // 2. validate the change
    validateSignupDetails(signupDetails);

    // 3. modify the entry in db
    let user1;
    if (signupDetails.password != "") {
      user1 = await UserModel.findOneAndUpdate(
        { id },
        { password: signupDetails.password }
      );
    } else {
      user1 = await UserModel.findOneAndUpdate(
        { id },
        { username: signupDetails.username }
      );
    }

    if (user1 == null) {
      throw new DbReadException("User does not exist.");
    }

    const user: User = {
      username: user1.username,
      password: user1.password,
      id: user1.id,
    };
    // 3. then we return the user as an interface
    return user;
  } catch (error) {
    if (error instanceof UserServiceException) {
      console.log("h");
      throw error;
    }
    throw new DbWriteException("Error creating user!");
  }
}

/**
 * Checks that a user with the given login details exists.
 */
export async function userWithUsernameExists(username: string) {
  const isinside = Boolean(await UserModel.exists({ username: username }));
  return isinside;
}

/**
 * Checks that a user with the given id exists.
 */
export async function userWithIdExists(id: string) {
  return Boolean(await UserModel.exists({ id }));
}
/**
 * Tries to delete a user with the specified username.
 */
export async function deleteUser(userId: string) {
  try {
    // 1. check if user exists
    if (!(await userWithIdExists(userId))) {
      throw new DbWriteException(
        "User does not exist, but we are trying to delete them."
      );
    }

    // 2. delete user
    await UserModel.deleteOne({ id: userId });
  } catch (error) {
    throw new DbWriteException("Error deleting user!");
  }
}

/**
 * Handles the login authentication by checking if the username-password pair
 * exists in the db.
 */
export async function loginUser(loginDetails: LoginDetails) {
  try {
    console.debug("Called loginUser, " + loginDetails.username);
    const user = await UserModel.findOne({
      username: loginDetails.username,
      password: loginDetails.password,
    }).exec();
    console.debug("Found user: " + user);
    if (user == null) {
      return undefined;
    }
    const userDetails: User = {
      username: user.username,
      password: user.password,
      id: user.id,
    };
    return userDetails;
  } catch (error) {
    throw new DbReadException("Error trying to login!");
  }
}

/**
 * Given the username, password and new password, handles the
 * changing of the password.
 */
export async function changePassword(
  username: string,
  password: string,
  newPassword: string
) {
  // 1. try to login to authenticate
  const isAuthorized = await loginUser({
    username,
    password,
  });
  if (isAuthorized == null) {
    throw new DbPermissionDeniedException("Not authorized to change password!");
  }

  try {
    // 2. if login successful, change password
    const filter = { username };
    const update = { password: newPassword };

    const userModel = await UserModel.findOneAndUpdate(
      filter,
      update,
      { new: true } // returns updated object
    );

    // 3. then we return the user as an interface
    if (userModel != null) {
      const user: User = {
        username: userModel.username,
        password: userModel.password,
        id: userModel._id.toString(),
      };
      return user;
    }
  } catch (error) {
    throw new DbWriteException("Error changing password!");
  }
}

/**
 * Checks that signup details are valid. Throws an exception if not.
 */
export function validateSignupDetails(details: SignUpDetails) {
  const { username, password } = details;

  const isValid =
    !!username.match(
      // regex validation. username must be alphanumeric with underscores and .
      /^[a-z0-9_.]+$/
    ) && // minimum 8 characters, maximum 20 characters
    username.trim().length >= 1 &&
    username.trim().length <= 20;
  if (!isValid) {
    throw new UserDetailValidationException(
      "Invalid username! Needs to be alphanumeric, no special characters, and between 1 and 20 characters."
    );
  }
}
