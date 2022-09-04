import axios, { AxiosError } from "axios";
import {
  USER_SERVICE_SIGNUP_URL,
  USER_SERVICE_LOGIN_URL,
  USER_SERVICE_AUTHENTICATE_URL,
  USER_SERVICE_LOGOUT_URL,
} from "../constants";

export interface UserInfoApiResponseData {
  userId: string;
  username: string;
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
  //   const respose = await axios
  //     .post(USER_SERVICE_SIGNUP_URL, {
  //       username,
  //       password,
  //     })
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
    data: { username: "test", userId: "test" },
  };
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
  //   const respose = await axios
  //     .post(USER_SERVICE_LOGIN_URL, {
  //       username,
  //       password,
  //     })
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
    data: { username: "test", userId: "test" },
  };
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
    data: { username: "test", userId: "test" },
  };
  // // dummy error response
  // return {
  //   status: 500,
  //   data: { username: "test", userId: "test", message: "Error!" },
  // }; // dummy data for now
};
