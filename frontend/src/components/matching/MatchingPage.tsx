import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "../../contexts/UserContext";
import useIsMobile from "../../hooks/useIsMobile";

const serverUri = process.env.MATCHING_SERVICE_URI || "http://localhost:8001";

function MatchingPage() {
  // ====== State management ======
  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] =
    useState<Boolean>(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState<String>("");

  // contexts
  const { user, socket, createSocket } = useContext(UserContext) as UserContextType;

  socket?.on("matchSuccess", (room: any) => {
    console.log("room: ", room);
  })

  useEffect(() => {
    createSocket(serverUri);
  }, []);

  // ====== Event handlers ======

    const createPendingMatch = (difficulty: number) => {
        if (!socket || !socket.connected) {
            createSocket(serverUri);
        }
        if (socket) {
            socket.emit("match", {
                userId: user.userId,
                difficulty,
            });
        }
    }

  // ====== UI components ======
  const matchOptionCard = (
    title: string,
    description: string,
    onClick: () => void
  ) => {
    return (
      <Card elevation={24}>
        <CardActionArea onClick={onClick}>
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
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={4}
    >
      <Grid item xs={12} md={4}>
        {matchOptionCard(
          "Easy",
          "Choose this if you're new to programming",
          () => createPendingMatch(0),
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        {matchOptionCard(
            "Medium",
            "For most people.",
            () => createPendingMatch(1),
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        {matchOptionCard(
            "Hard",
            "Dark Souls, but for programmers",
            () => createPendingMatch(2)
        )}
      </Grid>
    </Grid>
  );

  // ====== Render ======
  return (
    <div
      className="MatchingPage"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {matchingSelection}
    </div>
  );
}

export default MatchingPage;
