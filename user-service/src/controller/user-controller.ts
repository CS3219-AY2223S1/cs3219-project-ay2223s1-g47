import { ENV_IS_PROD, PW_SALT } from "../constants";
import { LoginDetails, SignUpDetails } from "../interfaces/login-details";
import {
  createUser,
  modifyUser,
  loginUser,
  userWithIdExists,
  getUserWithId,
} from "./services/user-services";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import {
  createBadRequestResponse,
  createInternalServerErrorResponse,
  createOkResponse,
  createUnauthorizedResponse,
} from "./services/response-services";
import { checkJWT, signJWT } from "./services/jwt-services";
import { User } from "../interfaces/user";
import { UserServiceException } from "../exceptions";

/**
 * Handles a POST request to create a user.
 */
export async function handleCreateUser(request: Request, response: Response) {
  try {
    console.debug("Called handleCreateUser");
    // 1. get the username and password from the request body
    const signupDetails: SignUpDetails =
      request.body as unknown as SignUpDetails;
    const username = signupDetails.username;
    const password = signupDetails.password;

    // 2. salt the password
    console.debug("Salting password: " + PW_SALT + ", " + password);
    const saltedPassword = bcrypt.hashSync(password, PW_SALT);

    // 3. create user
    console.debug("Creating user: " + username + " , " + saltedPassword);
    const user = await createUser({
      username: username,
      password: saltedPassword,
    });

    return createOkResponse(response, user);
  } catch (error) {
    console.error(error);
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
  console.debug("Called login");
  try {
    // 1. get login details from request body
    const loginDetails: LoginDetails = request.body as unknown as LoginDetails;
    const username = loginDetails.username;
    const password = loginDetails.password;

    // 2. hash password
    console.debug("Salting password: " + PW_SALT + ", " + password);
    const saltedPassword = bcrypt.hashSync(password, PW_SALT);

    // 3. call service to handle login
    console.debug("Logging in user: " + username + " , " + saltedPassword);
    const user = await loginUser({
      username,
      password: saltedPassword,
    });

    if (user == null) {
      console.debug("Tried to log in, but incorrect username/password!");
      return createUnauthorizedResponse(
        response,
        "Incorrect username/password!"
      );
    }

    // 4. jwt the user, add the jwt as http only cookie
    const jwt = await signJWT(user);

    response.cookie("JWT", jwt, { httpOnly: true, secure: ENV_IS_PROD });
    console.debug("Cookie set: " + jwt);

    response = createOkResponse(response, user);
    return response;
  } catch (error) {
    console.error(error);
    const message =
      error instanceof UserServiceException ? error.message : undefined;
    const statusCode =
      error instanceof UserServiceException ? error.statusCode : undefined;
    return createInternalServerErrorResponse(response, statusCode, message);
  }
}

/**
 * Handles a POST request to logout a user.
 */
export async function logout(request: Request, response: Response) {
  // 1. clear cookie
  response.cookie("JWT", "", { httpOnly: true, secure: ENV_IS_PROD });

  // 2. 200 ok
  return createOkResponse(response, { message: "Logged out." });
}

/**
 * Handles a PUT request to change an account's username
 */
export async function changeUsername(request: Request, response: Response) {
  try {
    // 1. check jwt
    const jwtPayload = (await checkJWT(request)) as unknown as User;
    if (!jwtPayload) {
      return createUnauthorizedResponse(response, "Invalid JWT");
    }

    // 2. check user exists
    const id = jwtPayload.id ?? "";
    const exists = await userWithIdExists(id);
    if (!exists) {
      return createUnauthorizedResponse(response, "Invalid JWT");
    }

    // 2. get new details from request body
    const loginDetails: LoginDetails = request.body as unknown as LoginDetails;
    const username = loginDetails.username;

    // 3. modify user
    const user = await modifyUser(id, { username, password: "" });
    response.json(user);
  } catch (error) {
    console.error(error);
    const message =
      error instanceof UserServiceException ? error.message : undefined;
    const statusCode =
      error instanceof UserServiceException ? error.statusCode : undefined;
    return createInternalServerErrorResponse(response, statusCode, message);
  }
}

/**
 * Handles a PUT request to change an account's password
 */
export async function changePassword(request: Request, response: Response) {
  try {
    // 1. check jwt
    const jwtPayload = (await checkJWT(request)) as unknown as User;
    if (!jwtPayload) {
      return createUnauthorizedResponse(response, "Invalid JWT");
    }

    // 2. check user exists
    const id = jwtPayload.id ?? "";
    const exists = await userWithIdExists(id);
    if (!exists) {
      return createUnauthorizedResponse(response, "Invalid JWT");
    }

    // 2. get new details from request body
    const loginDetails: LoginDetails = request.body as unknown as LoginDetails;
    const password = loginDetails.password;

    // 3. hash new password
    const saltedPassword = bcrypt.hashSync(password, PW_SALT);

    // 3. modify user
    const user = await modifyUser(id, {
      username: jwtPayload.username,
      password: saltedPassword,
    });
    response.json(user);
  } catch (error) {
    console.error(error);
    const message =
      error instanceof UserServiceException ? error.message : undefined;
    const statusCode =
      error instanceof UserServiceException ? error.statusCode : undefined;
    return createInternalServerErrorResponse(response, statusCode, message);
  }
}

/**
 * Handles a GET request to see if the jwt's match.
 */
export async function auth(request: Request, response: Response) {
  console.debug("Called auth");
  // 1. check jwt
  const jwtPayload = (await checkJWT(request)) as unknown as User;
  if (!jwtPayload) {
    return createUnauthorizedResponse(response, "Invalid JWT");
  }

  // 2. check user exists
  const id = jwtPayload.id ?? "";
  const exists = await userWithIdExists(id);
  if (!exists) {
    return createUnauthorizedResponse(response, "Invalid JWT");
  }

  // 3. return user
  return createOkResponse(response, jwtPayload);
}

/**
 * Handles a POST request to see if the jwt's match.
 */
export async function auth_server(request: Request, response: Response) {
  console.debug("Called auth server");
  // 1. check jwt
  const jwtCookie = request.body.jwt; // we expect a jwt in the body
  const jwtPayload = (await checkJWT(jwtCookie)) as unknown as User;
  if (!jwtPayload) {
    return createUnauthorizedResponse(response, "Invalid JWT");
  }

  // 2. check user exists
  const id = jwtPayload.id ?? "";
  const exists = await userWithIdExists(id);
  if (!exists) {
    return createUnauthorizedResponse(response, "Invalid JWT");
  }

  // 3. return user
  return createOkResponse(response, jwtPayload);
}

/**
 * Handles a get request to get a new jwt.
 */
export async function get_jwt(request: Request, response: Response) {
  console.debug("Called get jwt");
  // 1. check jwt
  const jwtCookie = request.cookies.JWT;
  const user = (await checkJWT(jwtCookie)) as unknown as User;
  if (!user) {
    return createUnauthorizedResponse(response, "Invalid JWT");
  }

  // 2. check user exists
  const id = user.id ?? "";
  const exists = await userWithIdExists(id);
  if (!exists) {
    return createUnauthorizedResponse(response, "Invalid JWT");
  }

  // 3. return user
  const jwt = await signJWT(user);
  return createOkResponse(response, { jwt: jwt });
}

/**
 * Handles a get request to get a username given the id.
 */
export async function getUsernameFromId(request: Request, response: Response) {
  // 1. authenticate
  // TODO: we do this next time

  // 2. get id from request
  const id = request.query.id as unknown as string;
  if (!id) {
    return createBadRequestResponse(response, "Missing id");
  }

  // 3. get username from id
  const user = await getUserWithId(id);

  // 4. return username
  return createOkResponse(response, { username: user.username });
}
