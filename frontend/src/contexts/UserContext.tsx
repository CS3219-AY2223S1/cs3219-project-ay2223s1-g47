import React, { useState, createContext, useEffect, useMemo } from "react";
import { io, Socket } from "socket.io-client";
import {
  apiCallUserAuthentication,
  apiCallUserLogin,
  apiCallUserLogout,
  UserInfoApiResponseData,
} from "../api/UserServiceApi";
import { User } from "../interfaces/users/User";

/**
 * This interface defines the user context used throughout the frontend.
 * It contains the user data and the functions to update the user data.
 */
export interface UserContextType {
  socket: Socket | undefined;
  user: User;
  isLoggedIn: boolean;
  login: (
    username: string,
    password: string
  ) => Promise<{ status: number; data: UserInfoApiResponseData }>;
  logout: () => Promise<{ status: number; data: {} }>;
  webSocket: WebSocket | undefined;
  createWebSocket: (url: string) => Promise<WebSocket>;
  clearWebSocket: () => Promise<void>;
  createSocket: (url: string) => Promise<Socket>;
  clearSocket: () => Promise<void>;
}

/**
 * This defines the user context and provider. We simply need to call a hook
 * to use the context in any consumer component, and upon any change in the
 * context, all subscribers will be re-rendered.
 */
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

const UserContextProvider = (props: { children: JSX.Element }) => {
  // ================ States =================
  // default user state
  const defaultUser: User = {
    username: "",
    userId: "",
  };
  const [user, setUser] = useState<User>(defaultUser);

  // logged in
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // socket.io state
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  // websocket state
  const [webSocket, setWebSocket] = useState<WebSocket | undefined>(undefined);

  // ================ Functions =================
  /**
   * Pings the backend to check if the user is authenticated and logged in.
   * Note the empty dependency array, which means this function will only be called
   * once.
   */
  useMemo(() => {
    apiCallUserAuthentication()
      .then((response) => {
        console.log(response);
        // if ok, set the user state
        if (response.status >= 200 && response.status < 300) {
          if (response.data.username && response.data.id) {
            const user: User = {
              username: response.data.username,
              userId: response.data.id,
            };
            setUser(user);
          }
        } else {
          // else, log the user out
          setIsLoggedIn(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isLoggedIn]);

  /**
   * Handles logging in and setting the global user state.
   */
  const login = async (username: string, password: string) => {
    const response = await apiCallUserLogin(username, password);
    // if ok, set the user state
    if (response.status >= 200 && response.status < 300) {
      if (response.data.username && response.data.id) {
        const user: User = {
          username: response.data.username,
          userId: response.data.id,
        };
        setUser(user);
        setIsLoggedIn(true);
      }
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
      setIsLoggedIn(false);
    }
    return response; // in either case, return data to caller
  };

  /**
   * Creates a socket io connection.
   */
  const createSocket = async (url: string) => {
    const socket: Socket = io(url, {
      query: {
        userId: user.userId,
      }, // should be {... : ...}, but we put "any" type to stop ts from complaining
    });
    setSocket(socket);
    return socket;
  };

  /**
   * Clears the socket io connection.
   */
  const clearSocket = async () => {
    setSocket(undefined);
  };

  /**
   * Creates a websocket connection.
   */
  const createWebSocket = async (url: string) => {
    const ws = new WebSocket(url);
    setWebSocket(ws);
    return ws;
  };

  /**
   * Clears the websocket connection.
   */
  const clearWebSocket = async () => {
    if (webSocket) {
      webSocket.close();
    }
    setWebSocket(undefined);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        socket: socket,
        createSocket: createSocket,
        clearSocket: clearSocket,
        webSocket: webSocket,
        createWebSocket: createWebSocket,
        clearWebSocket: clearWebSocket,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
