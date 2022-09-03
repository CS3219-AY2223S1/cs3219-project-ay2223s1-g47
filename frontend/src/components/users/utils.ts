const USERNAME_REGEX = "^[a-zA-Z0-9_]{3,20}$";

/**
 * Validates the password input.
 */
export const validatePassword = (
  password: string,
  reenteredPassword: string
) => {
  return password.length > 0 && password === reenteredPassword;
};

/**
 * Validates the username input.
 */
export const validateUsername = (username: string) => {
  const re: RegExp = new RegExp(USERNAME_REGEX);
  return username.length > 0 && re.test(username);
};
