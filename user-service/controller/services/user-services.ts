import { LoginDetails, SignUpDetails } from "../../interfaces/login-details";
import { User } from "../../interfaces/user";
import UserModel from "../../models/user-model";

/**
 * Creates and saves the user in db, and returns a backend interface of the user.
 */
export async function createUser(signupDetails: SignUpDetails) {
  try {
    // 1. check if user exists
    const username = signupDetails.username;
    if (await userWithUsernameExists(username)) {
      throw new DbWriteException(
        "User already exists, but we are trying to create a user."
      );
    }

    // 2. if user does not exist, we create and save the user
    const userModel = await new UserModel(signupDetails).save();

    // 3. then we return the user as an interface
    const user: User = {
      username: userModel.username,
      password: userModel.password,
      id: userModel._id.toString(),
    };
    return user;
  } catch (error) {
    throw new DbWriteException("Error creating user!");
  }
}

/**
 * Checks that a user with the given login details exists.
 */
export async function userWithUsernameExists(username: string) {
  return Boolean(await UserModel.exists({ username: username }));
}

/**
 * Tries to delete a user with the specified username.
 */
export async function deleteUser(username: string) {
  try {
    // 1. check if user exists
    if (!(await userWithUsernameExists(username))) {
      throw new DbWriteException(
        "User does not exist, but we are trying to delete them."
      );
    }

    // 2. delete user
    await UserModel.deleteOne({ username: username });
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
    const user = await UserModel.findOne(loginDetails);
    if (!user) {
      return undefined;
    }
    const userDetails: User = {
      username: user.username,
      password: user.password,
      id: user._id.toString(),
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
    username: username,
    password: password,
  });
  if (!isAuthorized) {
    throw new DbPermissionDeniedException("Not authorized to change password!");
  }

  try {
    // 2. if login successful, change password
    const filter = { username: username };
    const update = { password: newPassword };

    const userModel = await UserModel.findOneAndUpdate(
      filter,
      update,
      { new: true } // returns updated object
    );

    // 3. then we return the user as an interface
    if (userModel) {
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