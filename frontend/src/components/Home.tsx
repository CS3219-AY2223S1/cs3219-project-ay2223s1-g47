import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { editableInputTypes } from "@testing-library/user-event/dist/utils";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext, UserContextType } from "../contexts/UserContext";
import useIsMobile from "../hooks/useIsMobile";
import { ActiveRoomComponent } from "./collaboration/ActiveRoomComponent";
import MatchingPage from "./matching/MatchingPage";

const HomeComponent = styled.div`
  display: grid;
  grid-row-gap: 4rem;
  grid-template-rows: auto auto;
`;

const MatchingSection = styled.div`
  > h1 {
    color: rgb(255, 210, 150);
    margin: 0 auto;
    text-align: center;
    text-shadow: 5px 2px 20px rgba(255, 90, 8, .8);
  }

  > p {
    margin: 2rem auto 4rem auto;
    max-width: 600px;
    text-align: center;
  }
`;

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
    <HomeComponent>
      <ActiveRoomComponent/>
      <MatchingSection>
        <h1>Find a Match</h1>
        <p>
          Join a paired-programming session with a similarlly skilled programmer
        </p>
        <MatchingPage/>
      </MatchingSection>
    </HomeComponent>
  );
}
export default Home;
