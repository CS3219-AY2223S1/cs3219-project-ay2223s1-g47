import {
  Link,
  Snackbar,
} from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import useIsMobile from "../../hooks/useIsMobile";
import { validateUsername } from "./utils";
import MuiAlert from "@mui/material/Alert";
import { UserContext, UserContextType } from "../../contexts/UserContext";
import styled from "styled-components";
import { TextField } from "../TextField";

const LoginCard = styled.div`
  border-radius: 20px;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, .4),
      -5px -5px 15px 5px rgba(63, 63, 74, 1);
  margin: 0 auto;
  max-width: 500px;
  padding: 3rem 2rem 4rem 2rem;

  > form {
    display: grid;
    grid-row-gap: 2rem;
  }

  a {
    margin: 0 0 1rem 0;
  }

  > h1 {
    color: rgb(255, 179, 117);
    grid-area: heading;
    margin: 0 auto 4rem auto;
    text-align: center;
    text-shadow: 5px 2px 20px rgba(255, 90, 8, .8);
  }
`;

const Button = styled.button`
  background: rgb(46, 137, 255);
  border: none;
  border-radius: 2rem;
  box-shadow: 5px 5px 15px 5px rgba(34, 0, 224, .5);
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: bold;
  min-width: 0;
  padding: .8em 1.6em;

  &:hover {
    background: rgb(64, 159, 255);
    box-shadow: 5px 5px 15px 5px rgba(43, 54, 255, .5);
    cursor: pointer;
  }
`;

const Logo = styled.div`
    font-size: 3rem;
    font-weight: bold;
    margin: 0 0 4rem 0;
    text-align: center;

    > span:first-of-type {
        color: rgb(255, 179, 117);
        text-shadow: 5px 2px 20px rgba(255, 90, 8, .8);
    }
    > span:last-of-type {
        color: rgb(46, 137, 255);
        text-shadow: 5px 2px 20px rgba(34, 0, 224, .5);
    }
`;

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
  const handleLogin = async (e: any) => {
    e.preventDefault();
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

  /**
   * This renders the login form.
   */
  const loginForm = (
    <form onSubmit={handleLogin}>
      <TextField
        label="Username"
        type="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        hasError={isUsernameError}
        helperText={
          isUsernameError ? "3-20 characters, only letters, numbers, and underscores" : null
        }
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        hasError={isPasswordError}
        helperText={isPasswordError ? "Password cannot be empty!" : null}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Link href="/signup">Don't have an account?</Link>
      
      <Button>Login In</Button>
    </form>
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

  return (<>
    <Logo><span>Peer</span><span>Prep</span></Logo>
    <LoginCard>
      <h1>Log In</h1>
      {loginForm}
      {errorSnackbar}
    </LoginCard>
  </>
  );
}

export default LoginPage;
