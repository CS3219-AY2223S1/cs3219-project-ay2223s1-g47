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
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import { validateUsername } from "./utils";
import MuiAlert from "@mui/material/Alert";
import { UserContext, UserContextType } from "../../contexts/UserContext";

function LoginPage() {
  // =============== State management ===============
  // user input data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState("");

  // history
  const navigate = useNavigate();

  // contexts
  const { login } = useContext(UserContext) as UserContextType;

  // ================== Event handlers ==================
  /**
   * Makes the API call to login.
   */
  const handleLogin = async () => {
    // check and validate inputs
    if (!validateUsernameAndPassword()) {
      return;
    }

    // try to login in the backend
    await login(username, password)
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
        } else {
          console.log(response);
          const errorMessage: string =
            response.data.message ??
            "Something went wrong! Please try again later.";
          setErrorSnackbarContent(errorMessage);
        }
        setIsErrorSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(error);
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
    const passwordIsValid = password.length > 0;
    setIsPasswordError(!passwordIsValid);
    return usernameIsValid && passwordIsValid;
  };

  // ================== UI components ================
  /**
   * Renders the login form.
   */
  const loginFormButtons = (
    <Box>
      <Button
        style={{ width: "100%", textTransform: "none" }}
        variant="contained"
        onClick={handleLogin}
      >
        <Typography align="center" variant="subtitle1">
          Log in
        </Typography>
      </Button>
    </Box>
  );

  const loginFormInputFields = (
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
        helperText={isPasswordError && "Password cannot be empty!"}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ marginBottom: "2rem" }}
      />

      <Link href="/signup" underline="always" sx={{ marginBottom: "2rem" }}>
        <Typography noWrap={true} variant={"subtitle2"}>
          Don't have an account?
        </Typography>
      </Link>
    </Stack>
  );

  /**
   * This renders the login form.
   */
  const loginForm = (
    <Box display={"flex"} flexDirection={"column"} padding={"2rem"}>
      {loginFormInputFields}
      {loginFormButtons}
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
          Log in
        </Typography>
        {loginForm}
        {errorSnackbar}
      </Paper>
    </Box>
  );
}

export default LoginPage;
