import React from "react";

/**
 * Here we provide a global context for a user and its data. Important attributes like loggedin,
 * username, etc. are stored here.
 */
const userContext = React.createContext({ user: {} });

export { userContext };
