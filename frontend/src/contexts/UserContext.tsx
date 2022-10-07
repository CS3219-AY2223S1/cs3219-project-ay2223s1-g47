import React, { useState, createContext, useEffect } from "react";
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
  socketIo: Socket | null;
  user: User;
  login: (
    username: string,
    password: string
  ) => Promise<{ status: number; data: UserInfoApiResponseData }>;
  logout: () => Promise<{ status: number; data: {} }>;
  createSocketIo: (url: string, query: any) => Promise<Socket>;
  clearSocketIo: () => Promise<void>;
  webSocket: WebSocket | null;
  createWebSocket: (url: string) => Promise<WebSocket>;
  clearWebSocket: () => Promise<void>;
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
    loggedIn: true,
  };
  const [user, setUser] = useState<User>(defaultUser);

  // socket.io state
  const [socket, setSocket] = useState<Socket | null>(null);

  // websocket state
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  // ================ Functions =================
  /**
   * Pings the backend to check if the user is authenticated and logged in.
   * Note the empty dependency array, which means this function will only be called
   * once.
   */
  useEffect(() => {
    console.log("here");
    apiCallUserAuthentication()
      .then((response) => {
        console.log(response);
        // if ok, set the user state
        if (response.status >= 200 && response.status < 300) {
          console.log(response);
          if (response.data.username && response.data.id) {
            const user: User = {
              username: response.data.username,
              userId: response.data.id,
              loggedIn: true,
            };
            setUser(user);
          }
        } else {
          setUser({ ...defaultUser, loggedIn: false });
        }

        // else, do nothing
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

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
          loggedIn: true,
        };
        setUser(user);
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
    }
    return response; // in either case, return data to caller
  };

  /**
   * Creates a socket io connection.
   */
  const createSocketIo = async (url: string, query: any) => {
    const socket: Socket = io(url, {
      query: query, // should be {... : ...}, but we put "any" type to stop ts from complaining
    });
    setSocket(socket);
    return socket;
  };

  /**
   * Clears the socket io connection.
   */
  const clearSocketIo = async () => {
    setSocket(null);
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
    setWebSocket(null);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        socketIo: socket,
        createSocketIo: createSocketIo,
        clearSocketIo: clearSocketIo,
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
