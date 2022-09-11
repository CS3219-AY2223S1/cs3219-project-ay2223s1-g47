import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { UserContext, UserContextType } from "../../contexts/UserContext";
import useIsMobile from "../../hooks/useIsMobile";

function MatchingPage() {
  // ====== State management ======
  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] =
    useState<Boolean>(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState<String>("");

  // contexts
  const { user } = useContext(UserContext) as UserContextType;

  // ====== Event handlers ======

  // ====== UI components ======
  const matchOptionCard = (
    title: string,
    description: string,
    onclick: () => void
  ) => {
    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea>
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

  const matchingSelection = (
    <Grid container spacing={2} columns={{ xs: 12, sm: 4 }}>
      <Grid item>
        {matchOptionCard(
          "Easy",
          "Choose this if you're new to programming",
          () => {
            /* Event handler for clicking difficulty*/
          }
        )}
      </Grid>
      <Grid item>
        {matchOptionCard("Medium", "For most people.", () => {
          /* Event handler for clicking difficulty*/
        })}
      </Grid>
      <Grid item>
        {matchOptionCard("Hard", "Dark Souls, but for programmers", () => {
          /* Event handler for clicking difficulty*/
        })}
      </Grid>
    </Grid>
  );

  // ====== Render ======
  return <div className="MatchingPage">{matchingSelection}</div>;
}

export default MatchingPage;
