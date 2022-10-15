import {
  Button,
  TextField
} from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiCallUserChangeUsername,apiCallUserChangePassword } from "../api/userServiceApi";
import { UserContext, UserContextType } from "../contexts/UserContext";
import useIsMobile from "../hooks/useIsMobile";





function AccountPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isUsernameError, setIsUsernameError] = useState(false);
  const [isPasswordError, setIsPasswordError] = useState(false);

  // TODO: add user context
  // ================ State management ================
  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] =
    useState<Boolean>(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState<String>("");

  // contexts
  const { user } = useContext(UserContext) as UserContextType;

  // history
  const navigate = useNavigate();

  // ================ Event handlers ==================
  const handleChangeUsername = async () => {
    await apiCallUserChangeUsername(username, "")
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
  }

  const handleChangePassword = async () => {
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
  }

  // ================ UI rendering ===================
  const changeUser_TextField = 
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
      />
  const changeUser_button = 
  <Button
        style={{ width: "100%", textTransform: "none" }}
        variant="contained"
        onClick={handleChangeUsername}
      >confirm new username</Button>

      const changePassword_TextField = 
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
    const changePassword_button = 
    <Button
          style={{ width: "100%", textTransform: "none" }}
          variant="contained"
          onClick={handleChangePassword}
        >confirm new password</Button>




  // ====== Render ======
  return (
    <div
      className="Home"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {changeUser_TextField}
      {changeUser_button}
      <br></br>
      {changePassword_TextField}
      {changePassword_button}
    </div>
  );
}
export default AccountPage;
