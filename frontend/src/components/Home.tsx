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
import MatchingPage from "./matching/MatchingPage";




function Home() {


  // TODO: add user context
  // ================ State management ================
  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] =
    useState<Boolean>(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState<String>("");

  // contexts

  // history
  const navigate = useNavigate();

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

  // ====== Render ======
  return (
    <div>
      <h1>Find a Match</h1>
      <p>
        Join a paired-programming session with a similarlly skilled programmer
      </p>
      <MatchingPage/>
    </div>
  );
}
export default Home;
