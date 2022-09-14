import axios, { AxiosError } from "axios";
import { USER_SERVICE_SIGNUP_URL } from "../constants";

/**
 * Handles the API call to the user service for signing up. Returns a user object.
 */
export const handleSignupApi = async (username: string, password: string) => {
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
  return {
    status: 200,
    data: { username: "test", userId: "test", message: "Some test message!" },
  }; // dummy data for now
};
