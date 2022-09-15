import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext, UserContextType } from "../contexts/UserContext";
import useIsMobile from "../hooks/useIsMobile";

function Home() {
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
    </div>
  );
}
export default Home;
