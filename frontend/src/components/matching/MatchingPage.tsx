import {
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { apiGetNewJwt } from "../../api/UserServiceApi";
import { UserContext, UserContextType } from "../../contexts/UserContext";
import { MatchLoadingComponent } from "./MatchLoadingComponent";

const serverUri = process.env.MATCHING_SERVICE_URI || "http://localhost:8001";

function MatchingPage() {
  // ====== State management ======
  // UI states
    useState<Boolean>(false);
  const [isMatching, setIsMatching] = useState<Boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const [socketJwt, setSocketJwt] = useState<string>("");

  const navigate = useNavigate();

  // contexts
  const { user } = useContext(
    UserContext
  ) as UserContextType;

  socket?.on("matchSuccess", (room: string) => {
    navigate(`/room?roomId=${room}`);
  });

  /**
   * Hook that initializes authentication in preparation for the websocket connection.
   * Specifically, it gets a new JWT for the websocket connection.
   */
   useEffect(() => {
    apiGetNewJwt().then((response) => {
      if (response.status === 200) {
        setSocketJwt(response.data.jwt);
      } else {
        toast("Something went wrong.");
      }
    });
  }, []);

  // ====== Event handlers ======

    const onMatchingTimeout = () => {
        setIsMatching(false);
        toast("Matching timeout! Please make another match.");
    }

    const createPendingMatch = (difficulty: number) => {
        const newSocket = io(serverUri, {
            query: {
                userId: user.userId,
                socketJwt,
            },
        });
        setSocket(newSocket);
        newSocket.emit("match", {
            userId: user.userId,
            difficulty,
        });
        console.log("in createPendingMatch: ", newSocket);
        setIsMatching(true);
        setTimeout(onMatchingTimeout, 60 * 1000);
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
          () => createPendingMatch(0)
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        {matchOptionCard("Medium", "For most people.", () =>
          createPendingMatch(1)
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        {matchOptionCard("Hard", "Dark Souls, but for programmers", () =>
          createPendingMatch(2)
        )}
      </Grid>
    </Grid>
  );

  // ====== Render ======
  if (isMatching) return <MatchLoadingComponent/>

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
