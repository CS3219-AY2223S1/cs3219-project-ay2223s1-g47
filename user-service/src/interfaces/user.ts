/**
 * This interface defines the user we will use throughout the backend of the app.
 * It is intended to decouple the model in db with the interface we use throughout
 * the backend.
 */
export interface User {
  username: string;
  password: string;
  id: string;
}
