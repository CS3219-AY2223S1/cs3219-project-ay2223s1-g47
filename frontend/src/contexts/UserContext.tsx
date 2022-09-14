import React, { useState, createContext, useEffect } from "react";
import {
  apiCallUserAuthentication,
  apiCallUserLogin,
  apiCallUserLogout,
  UserInfoApiResponseData,
} from "../api/userServiceApi";
import { User } from "../interfaces/users/User";

/**
 * This interface defines the user context used throughout the frontend.
 * It contains the user data and the functions to update the user data.
 */
export interface UserContextType {
  user: User;
  login: (
    username: string,
    password: string
  ) => Promise<{ status: number; data: UserInfoApiResponseData }>;
  logout: () => Promise<{ status: number; data: {} }>;
}

/**
 * This defines the user context and provider. We simply need to call a hook
 * to use the context in any consumer component, and upon any change in the
 * context, all subscribers will be re-rendered.
 */
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

/**
 * This explicitly defines
 */
const UserContextProvider = (props: { children: JSX.Element }) => {
  // ================ States =================
  // default user state
  const defaultUser: User = {
    username: "",
    userId: "",
    loggedIn: false,
  };
  const [user, setUser] = useState<User>(defaultUser);

  // ================ Functions =================
  /**
   * Pings the backend to check if the user is authenticated and logged in.
   * Note the empty dependency array, which means this function will only be called
   * once.
   */
  useEffect(() => {
    apiCallUserAuthentication().then((response) => {
      // if ok, set the user state
      if (response.status === 200) {
        const user: User = {
          username: response.data.username,
          userId: response.data.userId,
          loggedIn: true,
        };
        setUser(user);
      }

      // else, do nothing
    });
  }, []);

  /**
   * Handles logging in and setting the global user state.
   */
  const login = async (username: string, password: string) => {
    const response = await apiCallUserLogin(username, password);
    // if ok, set the user state
    if (response.status === 200) {
      const user: User = {
        username: response.data.username,
        userId: response.data.userId,
        loggedIn: true,
      };
      setUser(user);
    }
    return response; // in either case, return data to caller
  };

  /**
   * Handles logging out and setting the global user state.
   */
  const logout = async () => {
    const response = await apiCallUserLogout();
    if (response.status === 200) {
      setUser(defaultUser);
    }
    return response; // in either case, return data to caller
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
