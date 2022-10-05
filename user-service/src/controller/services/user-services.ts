import { randomUUID } from 'crypto'
import {
  DbPermissionDeniedException,
  DbReadException,
  DbWriteException
  , DbWriteException, DbReadException, DbPermissionDeniedException
} from '../../exceptions'
import { LoginDetails, SignUpDetails } from '../../interfaces/login-details'
import { User } from '../../interfaces/user'
import UserModel from '../../models/user-model'

/**
 * Creates and saves the user in db, and returns a backend interface of the user.
 */
export async function createUser (signupDetails: SignUpDetails) {
  try {
    // 1. check if user exists
    const username = signupDetails.username
    if (await userWithUsernameExists(username)) {
      throw new DbWriteException('User already exists.')
    }

    // 2. if user does not exist, we create and save the user
    const userModel = await new UserModel({
      username: signupDetails.username,
      password: signupDetails.password,
      id: randomUUID()
    }).save()

    // 3. then we return the user as an interface
    const user: User = {
      username: userModel.username,
      password: userModel.password,
      id: userModel.id
    }
    return user
  } catch (error) {
    throw new DbWriteException('Error creating user!')
  }
}

/**
 * Checks that a user with the given login details exists.
 */
export async function userWithUsernameExists (username: string) {
  return Boolean(await UserModel.exists({ username }))
}

export async function userWithIdExists (id: string) {
  return Boolean(await UserModel.exists({ id }))
}
/**
 * Tries to delete a user with the specified username.
 */
export async function deleteUser (userId: string) {
  try {
    // 1. check if user exists
    if (!(await userWithIdExists(userId))) {
      throw new DbWriteException(
        'User does not exist, but we are trying to delete them.'
      )
    }

    // 2. delete user
    await UserModel.deleteOne({ id: userId })
  } catch (error) {
    throw new DbWriteException('Error deleting user!')
  }
}

/**
 * Handles the login authentication by checking if the username-password pair
 * exists in the db.
 */
export async function loginUser (loginDetails: LoginDetails) {
  try {
    console.debug('Called loginUser, ' + loginDetails.username)
    const user = await UserModel.findOne({
      username: loginDetails.username,
      password: loginDetails.password
    }).exec()
    console.debug('Found user: ' + user)
    if (user == null) {
      return undefined
    }
    const userDetails: User = {
      username: user.username,
      password: user.password,
      id: user.id
    }
    return userDetails
  } catch (error) {
    throw new DbReadException('Error trying to login!')
  }
}

/**
 * Given the username, password and new password, handles the
 * changing of the password.
 */
export async function changePassword (
  username: string,
  password: string,
  newPassword: string
) {
  // 1. try to login to authenticate
  const isAuthorized = await loginUser({
    username,
    password
  })
  if (isAuthorized == null) {
    throw new DbPermissionDeniedException('Not authorized to change password!')
  }

  try {
    // 2. if login successful, change password
    const filter = { username }
    const update = { password: newPassword }

    const userModel = await UserModel.findOneAndUpdate(
      filter,
      update,
      { new: true } // returns updated object
    )

    // 3. then we return the user as an interface
    if (userModel != null) {
      const user: User = {
        username: userModel.username,
        password: userModel.password,
        id: userModel._id.toString()
      }
      return user
    }
  } catch (error) {
    throw new DbWriteException('Error changing password!')
  }
}
