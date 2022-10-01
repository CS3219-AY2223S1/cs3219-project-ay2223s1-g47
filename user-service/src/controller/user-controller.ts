import { PW_SALT } from "../constants";
import { LoginDetails, SignUpDetails } from "../interfaces/login-details";
import { createUser, loginUser } from "./services/user-services";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import {
  createInternalServerErrorResponse,
  createUnauthorizedResponse,
} from "./services/response-services";

const salt = process.env.PW_SALT;

/**
 * Handles a POST request to create a user.
 */
export async function handleCreateUser(request: Request, response: Response) {
  try {
    // 1. get the username and password from the request body
    const signupDetails: SignUpDetails =
      request.body as unknown as SignUpDetails;
    const username = signupDetails.username;
    const password = signupDetails.password;

    // 2. salt the password
    console.debug("Salting password: " + PW_SALT + ", " + password);
    const saltedPassword = bcrypt.hashSync(password, PW_SALT);

    // 3. create user
    console.debug("Creating user: " + username + " ," + saltedPassword);
    const user = await createUser({ username, password: saltedPassword });

    response.json(user);
  } catch (error) {
    console.error(error);
    console.log("here");
    const message =
      error instanceof UserServiceException ? error.message : undefined;
    const statusCode =
      error instanceof UserServiceException ? error.statusCode : undefined;
    return createInternalServerErrorResponse(response, statusCode, message);
  }
}

/**
 * Handles a POST request to login a user.
 */
export async function login(request: Request, response: Response) {
  try {
  } catch (error) {
    console.error(error);
    if (error instanceof UserServiceException) {
      createInternalServerErrorResponse(
        response,
        error.statusCode,
        error.message
      );
    }
  }
  // 1. get login details from request body
  const loginDetails: LoginDetails = request.body as unknown as LoginDetails;
  const username = loginDetails.username;
  const password = loginDetails.password;

  // 2. hash password
  const saltedPassword = bcrypt.hashSync(password, PW_SALT);

  // 3. call service to handle login
  const user = await loginUser({
    username: username,
    password: saltedPassword,
  });

  if (!user) {
    return createUnauthorizedResponse(response, "Incorrect username/password!");
  }

  // 4. return jwt
  // TODO: for now we dont
  return response.status(200).json(user);
}

/**
 * Hanldes a POST request to logout a user.
 */
export async function logout(request: Request, response: Response) {
  // 1. clear cookie
  // TOOD: for now no jwt, so no difference
  // res.cookie("JWT", "", { httpOnly: true, secure: process.env.ENV == "PROD" });

  // 2. 200 ok

  return response.status(200).json({ message: "Logged out" });
}

/**
 * Handles a GET request to see if the jwt's match.
 */
export async function auth(request: Request, response: Response) {
  // // 1. check jwt
  // const jwtValidNotExpired = true;
  // const user: User = // from jwt decoded

  // // 2. if valid and not expired, return user details
  // return response.status(200).json(user);

  // 3. else return 401
  return createUnauthorizedResponse(response, "Not logged in.");
}
