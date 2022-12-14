import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  apiCallUserChangeUsername,
  apiCallUserChangePassword,
} from "../api/UserServiceApi";
import { UserContext, UserContextType } from "../contexts/UserContext";
import useIsMobile from "../hooks/useIsMobile";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Button } from "./Button";
import { TextField } from "./TextField";
import { validatePassword, validateUsername } from "../components/user/utils";

const SettingsCard = styled.form`
  border-radius: 20px;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.4),
    -5px -5px 15px 5px rgba(63, 63, 74, 1);
  margin: 0 auto;
  max-width: 600px;
  padding: 3rem 2rem 4rem 2rem;

  > form {
    display: grid;
    grid-column-gap: 1rem;
    grid-row-gap: 3rem;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto;
  }

  > h1 {
    color: rgb(255, 179, 117);
    grid-area: heading;
    margin: 0 auto 4rem auto;
    text-align: center;
    text-shadow: 5px 2px 20px rgba(255, 90, 8, 0.8);
  }
`;

const ButtonContainer = styled.div`
  margin: 1.2em 0 0 0;
`;

function AccountPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  // TODO: add user context
  // ================ State management ================
  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState<String>("");

  // contexts
  const { user } = useContext(UserContext) as UserContextType;

  // history
  const navigate = useNavigate();

  // ================ Event handlers ==================
  const handleChangeUsername = async (e: any) => {
    e.preventDefault();

    const usernameIsValid = validateUsername(username);
    setIsUsernameError(!usernameIsValid);
    if (!usernameIsValid) {
      return;
    }

    await apiCallUserChangeUsername(username, "")
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

  const handleChangePassword = async (e: any) => {
    e.preventDefault();

    const passwordIsValid = validatePassword(password, password);
    setIsPasswordError(!passwordIsValid);
    if (!passwordIsValid) {
      return;
    }

    await apiCallUserChangePassword("", password)
      .then((response) => {
        if (response.status === 200) {
          navigate("/");
        } else {
          const errorMessage: string =
            "Something went wrong! Please try again later.";
          setErrorSnackbarContent(errorMessage);
        }
        setIsErrorSnackbarOpen(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // ================ UI rendering ===================
  const changeUser_TextField = (
    <TextField
      label="Username"
      type="username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      hasError={isUsernameError}
      helperText={
        isUsernameError
          ? "3-20 characters, only letters, numbers, and underscores"
          : null
      }
    />
  );
  const changeUser_button = (
    <Button onClick={handleChangeUsername}>Confirm New Username</Button>
  );

  const changePassword_TextField = (
    <TextField
      label="Password"
      type="password"
      value={password}
      hasError={isPasswordError}
      helperText={
        isPasswordError ? "Password must be at least 8 characters long!" : null
      }
      onChange={(e) => setPassword(e.target.value)}
    />
  );
  const changePassword_button = (
    <Button onClick={handleChangePassword}>Confirm New Password</Button>
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

  // ====== Render ======
  return (
    <SettingsCard>
      <h1>Settings</h1>
      <form>
        {changeUser_TextField}
        <ButtonContainer>{changeUser_button}</ButtonContainer>
        {changePassword_TextField}
        <ButtonContainer>{changePassword_button}</ButtonContainer>
      </form>
      {errorSnackbar}
    </SettingsCard>
  );
}
export default AccountPage;
