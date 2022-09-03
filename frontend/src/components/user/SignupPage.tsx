import {
  Box,
  Button,
  Link,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { handleSignupApi } from "../../api/userServiceApi";
import useIsMobile from "../../hooks/useIsMobile";
import { validatePassword, validateUsername } from "./utils";

function SignupPage() {
  // =============== State management ===============
  // user input data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [reenteredPassword, setReenteredPassword] = useState("");

  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  // history
  const navigate = useNavigate();

  // =============== Event handlers ===============
  /**
   * Makes the API call to sign up.
   */
  const handleSignup = async () => {
    // check and validate inputs
    if (!validateUsernameAndPassword()) {
      return;
    }

    // try to sign up in the backend
    await handleSignupApi(username, password).then((response) => {
      if (response.status === 200) {
        navigate("/login");
      } else {
        const messageFromBackend: string = response.data.message;
        setErrorSnackbarContent(
          messageFromBackend
            ? messageFromBackend
            : "Something went wrong! Please try again later."
        );
      }
      setIsErrorSnackbarOpen(true);
    });
  };

  /**
   * Handles input validation.
   */
  const validateUsernameAndPassword = () => {
    // validate username
    const usernameIsValid = validateUsername(username);
    setIsUsernameError(!usernameIsValid);

    // validate password
    const passwordIsValid = validatePassword(password, reenteredPassword);
    setIsPasswordError(!passwordIsValid);
    return usernameIsValid && passwordIsValid;
  };

  // =============== UI rendering ===============

  const signUpFormInputFields = (
    <Stack>
      <TextField
        label="Username"
        variant="outlined"
        type="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        sx={{ marginBottom: "1rem" }}
        error={isUsernameError}
        helperText={
          isUsernameError &&
          "3-20 characters, only letters, numbers, and underscores"
        }
        autoFocus
      />
      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        error={isPasswordError}
        helperText={isPasswordError && "Passwords must match!"}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginBottom: "2rem" }}
      />
      <TextField
        label="Confirm Password"
        variant="outlined"
        type="password"
        value={reenteredPassword}
        onChange={(e) => setReenteredPassword(e.target.value)}
        error={isPasswordError}
        helperText={isPasswordError && "Passwords must match!"}
        sx={{ marginBottom: "1rem" }}
      />
      <Link href="/login" underline="always" sx={{ marginBottom: "2rem" }}>
        <Typography noWrap={true} variant={"subtitle2"}>
          Already have an account?
        </Typography>
      </Link>
    </Stack>
  );

  const signUpFormButtons = (
    <Box>
      <Button
        style={{ width: "100%", textTransform: "none" }}
        variant="contained"
        onClick={handleSignup}
      >
        <Typography align="center" variant="subtitle1">
          Sign up
        </Typography>
      </Button>
    </Box>
  );

  /**
   * This renders the sign up form.
   */
  const signUpForm = (
    <Box display={"flex"} flexDirection={"column"} padding={"2rem"}>
      {signUpFormInputFields}
      {signUpFormButtons}
    </Box>
  );

  /**
   * This renders the error snackbar.
   */
  const errorSnackbar = (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={isErrorSnackbarOpen}
      autoHideDuration={5000}
      onClose={() => setIsErrorSnackbarOpen(false)}
      role="alert"
    >
      <MuiAlert elevation={6} variant="filled" severity="error">
        {errorSnackBarContent}
      </MuiAlert>
    </Snackbar>
  );

  return (
    <Box display={"flex"} alignItems={"center"} flexDirection={"column"}>
      <Paper
        elevation={24}
        style={{
          width: isMobile ? "90%" : "30rem",
          paddingTop: "40px",
          paddingLeft: isMobile ? "0px" : "20px",
          paddingRight: isMobile ? "0px" : "20px",
          paddingBottom: "40px",
        }}
      >
        <Typography variant={"h2"} marginBottom={"2rem"} textAlign={"center"}>
          Sign Up
        </Typography>
        {signUpForm}
        {errorSnackbar}
      </Paper>
    </Box>
  );
}

export default SignupPage;
