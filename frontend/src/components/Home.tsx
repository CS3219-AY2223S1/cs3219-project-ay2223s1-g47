import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../contexts/UserContext";
import useIsMobile from "../hooks/useIsMobile";




function Home() {

  const { logout } = useContext(UserContext) as UserContextType;


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
  const goToMatchingPage: () => void = () => {
    navigate("/match");
  };
  const goToAccountPage: () => void = () => {
    navigate("/account");
  };

  const handleLogout = async () => {
    await logout().then((response) => {
      if (response.status === 201) {
        navigate("/login");
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
  const quickRedirectCard = (
    title: string,
    description: string,
    onClick?: () => void
  ) => {
    return (
      <Card elevation={24}>
        <CardActionArea onClick={onClick ?? undefined}>
          {/*some image*/}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  };

  const quickActionsPanel = (
    <Grid container direction="row" alignItems="center" justifyContent="center">
      <Grid item xs={12} md={4}>
        {quickRedirectCard(
          "Find a match",
          "Join a paired-programming session with a similarlly skilled programmer",
          goToMatchingPage
        )}
      </Grid>

      <Grid item xs={12} md={4}>
        {quickRedirectCard(
          "Account Settings",
          "change account info",
          goToAccountPage
        )}
      </Grid>
    </Grid>
  );

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
      {quickActionsPanel}
      <br/>
      <Button
        style={{ width: "100%", textTransform: "none" }}
        variant="contained"
        onClick={handleLogout}
      >logout</Button>
    </div>
  );
}
export default Home;
