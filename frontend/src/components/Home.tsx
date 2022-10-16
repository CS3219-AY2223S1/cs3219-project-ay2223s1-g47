import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
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
    color: rgb(255, 179, 117);
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
  const [activeRoom, setActiveRoom] = useState<any>();
  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] =
    useState<Boolean>(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState<String>("");

  const navigate = useNavigate();

  const handleCheckMostRecentRoom = () => {
    const room = {};
    setActiveRoom(room);
  }

  const handleJoinRoom = () => {
    navigate(`/room?roomId=${activeRoom.room_id}`);
  }

  const handleDisconnectRoom = () => {

  }

  useEffect(() => {
    handleCheckMostRecentRoom();
  }, []);

  // ====== Render ======
  return (
    <HomeComponent>
      {activeRoom &&
        <ActiveRoomComponent
          onJoin={handleJoinRoom}
          onDisconnect={handleDisconnectRoom}
        />
      }
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
