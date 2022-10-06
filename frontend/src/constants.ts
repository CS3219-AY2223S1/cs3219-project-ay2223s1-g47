// ================ Colours ==================
export const colours = {
  primary: "#9b5de5",
  secondary: "#e63946",
  white: "#ffffff",
  black: "#000000",
  success: "#4caf50",
  info: "#00bcd4",
  warning: "#ffeb3b",
  danger: "#f44336",
};

// ================ Fonts ==================

// ================ Response codes ==================
export const STATUS_CODE_CREATED = 201;
export const STATUS_CODE_CONFLICT = 409;

// ================ API ==================
// user service
const USER_SERVICE_DOMAIN =
  process.env.URI_USER_SERVICE || "http://localhost:8000";
export const USER_SERVICE_SIGNUP_URL = USER_SERVICE_DOMAIN + "/signup";
export const USER_SERVICE_LOGIN_URL = USER_SERVICE_DOMAIN + "/login";
export const USER_SERVICE_LOGOUT_URL = USER_SERVICE_DOMAIN + "/logout";
export const USER_SERVICE_AUTHENTICATE_URL = USER_SERVICE_DOMAIN + "/auth";

// collaboration service
const COLLABORATION_SERVICE_DOMAIN =
  process.env.URI_COLLABORATION_SERVICE || "http://localhost:8003";
export const COLLABORATION_SERVICE_GET_ROOM_URL =
  COLLABORATION_SERVICE_DOMAIN + "/crud/get_room";
