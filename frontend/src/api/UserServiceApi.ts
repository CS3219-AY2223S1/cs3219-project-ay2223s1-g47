import axios, { AxiosError } from "axios";
import {
  USER_SERVICE_SIGNUP_URL,
  USER_SERVICE_LOGIN_URL,
  USER_SERVICE_AUTHENTICATE_URL,
  USER_SERVICE_LOGOUT_URL,
  USER_SERVICE_NEW_JWT_URL,
} from "../constants";

export interface UserInfoApiResponseData {
  id?: string;
  username?: string;
  message?: string;
}

/**
 * Handles the API call to the user service for signing up.
 */
export const apiCallUserSignup: (
  username: string,
  password: string
) => Promise<{ status: number; data: UserInfoApiResponseData }> = async (
  username: string,
  password: string
) => {
  const response = axios
    .post(USER_SERVICE_SIGNUP_URL, {
      username,
      password,
    })
    .catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        return error.response?.data; // return response data from backend
      } else {
        console.error(error);
        return error; // propagate up the call stack
      }
    }) as Promise<{ status: number; data: UserInfoApiResponseData }>;

  return response;

  // // dummy success response
  // return {
  //   status: 200,
  //   data: { username: "test", userId: "test" },
  // };
  // // dummy error response
  // return {
  //   status: 500,
  //   data: { username: "test", userId: "test", message: "Error!" },
  // }; // dummy data for now
};

/**
 * Handles the API call to the user service for logging in.
 */
export const apiCallUserLogin: (
  username: string,
  password: string
) => Promise<{ status: number; data: UserInfoApiResponseData }> = async (
  username: string,
  password: string
) => {
  const response = axios
    .post(
      USER_SERVICE_LOGIN_URL,
      {
        username,
        password,
      },
      { withCredentials: true }
    )
    .catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        return error.response?.data; // return response data from backend
      } else {
        console.error(error);
        return error; // propagate up the call stack
      }
    }) as Promise<{ status: number; data: UserInfoApiResponseData }>;

  return response;
  // // dummy success response
  // return {
  //   status: 200,
  //   data: { username: "test", id: "test" },
  // };
  // // dummy error response
  // return {
  //   status: 500,
  //   data: { username: "test", userId: "test", message: "Error!" },
  // }; // dummy data for now
};

/**
 * Handles the API call to the user service to logout.
 */
export const apiCallUserLogout: () => Promise<{
  status: number;
  data: {};
}> = async () => {
  //   const respose = await axios
  //     .get(USER_SERVICe_AUTHENTICATE_URL, {})
  //     .catch((error: Error | AxiosError) => {
  //       if (axios.isAxiosError(error)) {
  //         return error.response?.data; // return response data from backend
  //       } else {
  //         console.error(error);
  //         return error; // propagate up the call stack
  //       }
  //     });
  // dummy success response
  return {
    status: 200,
    data: {},
  };
};

/**
 * Handles the API call to the user service to authenticate if the session is
 * valid (an thus, implicitly, if the user is logged in).
 *
 * Because we implement JWT authenticaion with http only cookies, we don't need to
 * send any data to the backend to authenticate the session. We simply need to ping it.
 */
export const apiCallUserAuthentication: () => Promise<{
  status: number;
  data: UserInfoApiResponseData;
}> = async () => {
  const response = axios
    .get(USER_SERVICE_AUTHENTICATE_URL, {
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
    .catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        return error.response?.data; // return response data from backend
      } else {
        console.error(error);
        return error; // propagate up the call stack
      }
    }) as Promise<{ status: number; data: UserInfoApiResponseData }>;

  return response;
  // // dummy success response
  // return {
  //   status: 200,
  //   data: { username: "test", userId: "test" },
  // };
  // // dummy error response
  // return {
  //   status: 401,
  //   data: { username: "test", id: "test", message: "Not logged in!" },
  // }; // dummy data for now
};

/**
 * Handles API call to get a new temporary jwt token. Useful for things like socket connections.
 */
export const apiGetNewJwt: () => Promise<{
  status: number;
  data: { jwt: string };
}> = async () => {
  const response = axios
    .get(USER_SERVICE_NEW_JWT_URL, {
      withCredentials: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
    .catch((error: Error | AxiosError) => {
      if (axios.isAxiosError(error)) {
        return error.response?.data; // return response data from backend
      } else {
        console.error(error);
        return error; // propagate up the call stack
      }
    }) as Promise<{ status: number; data: { jwt: string } }>;

  return response;
};
