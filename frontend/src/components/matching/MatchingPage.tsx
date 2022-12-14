import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { io, Socket } from "socket.io-client";
import { apiGetNewJwt } from "../../api/UserServiceApi";
import { UserContext, UserContextType } from "../../contexts/UserContext";
import { MatchLoadingComponent } from "./MatchLoadingComponent";
import styled from "styled-components";
import { Button } from "../Button";

const serverUri = process.env.MATCHING_SERVICE_URI || "http://localhost:8001";

const Grid = styled.div`
  display: grid;
  grid-column-gap: 3rem;
  grid-template-columns: 1fr 1fr 1fr;
`;

const Card = styled.div`
  align-items: center;
  border-radius: 20px;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.4),
    -5px -5px 15px 5px rgba(63, 63, 74, 1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2em 1em;
  text-align: center;

  p {
    flex: 1;
    margin: 1rem 0 2rem 0;
  }

  h2 {
    color: rgb(255, 179, 117);
    text-shadow: 5px 2px 20px rgba(255, 90, 8, 0.8);
  }
`;

function MatchingPage() {
  // ====== State management ======
  // UI states
  useState<Boolean>(false);
  const [isMatching, setIsMatching] = useState<Boolean>(false);
  const [socket, setSocket] = useState<Socket>();
  const [socketJwt, setSocketJwt] = useState<string>("");

  const navigate = useNavigate();

  // contexts
  const { user } = useContext(UserContext) as UserContextType;

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

  const onDisconnect = () => {
    socket?.disconnect();
    setIsMatching(false);
  };

  const onMatchingTimeout = () => {
    setIsMatching(false);
    toast("Matching timeout! Please make another match.");
  };

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
  };

  // ====== UI components ======
  const matchOptionCard = (
    title: string,
    description: string,
    onClick: () => void
  ) => {
    return (
      <Card>
        <h2>{title}</h2>
        <p>{description}</p>
        <Button onClick={onClick}>Select</Button>
      </Card>
    );
  };

  const matchingSelection = (
    <>
      {matchOptionCard(
        "Easy",
        "Choose this if you're new to programming.",
        () => createPendingMatch(0) // TODO: use enums rather than magic numbers
      )}
      {matchOptionCard("Medium", "For most people.", () =>
        createPendingMatch(1)
      )}
      {matchOptionCard(
        "Hard",
        "Dark Souls, but for programmers. You have been warned!",
        () => createPendingMatch(2)
      )}
    </>
  );

  // ====== Render ======
  if (isMatching) return <MatchLoadingComponent onDisconnect={onDisconnect} />;

  return <Grid>{matchingSelection}</Grid>;
}

export default MatchingPage;
