import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  apiGetRoomHistory,
  convertRoomApiResponseToRoom,
  RoomApiResponseData,
} from "../api/CollaborationServiceApi";
import { UserContext, UserContextType } from "../contexts/UserContext";
import useIsMobile from "../hooks/useIsMobile";
import { Room } from "../interfaces/collaboration/Room";
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
    text-shadow: 5px 2px 20px rgba(255, 90, 8, 0.8);
  }

  > p {
    margin: 2rem auto 4rem auto;
    max-width: 600px;
    text-align: center;
  }
`;

function Home() {
  // TODO: add user context

  // ===================== Contexts =====================
  const { user } = useContext(UserContext) as UserContextType;

  // ================ State management ================
  const [activeRoomId, setActiveRoomId] = useState<string | undefined>(
    undefined
  );
  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] =
    useState<Boolean>(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState<String>("");

  const navigate = useNavigate();

  // ================ Functions =================
  /**
   * Handles retrieving the most recent room, if there exists one.
   */
  const handleCheckMostRecentRoom = async () => {
    // api call
    const response = await apiGetRoomHistory();
    if (response.status >= 200 && response.status < 300) {
      if (response.data) {
        console.log(response);
        // TODO: error logging/snackbar

        // convert to room
        const data = response.data as RoomApiResponseData[];
        const rooms = data.map((room) => {
          return convertRoomApiResponseToRoom(room);
        });

        // sort by date
        rooms.sort((room1: Room, room2: Room) => {
          return room1.createdAt > room2.createdAt ? -1 : 1;
        });

        // set most recent room
        if (rooms.length > 0) {
          setActiveRoomId(rooms[0].roomId);
        }
      }
    }
  };

  /**
   * Handles redirection to the room page, and only does so if the room id is valid.
   */
  const handleJoinRoom = () => {
    if (!!activeRoomId) {
      navigate(`/room?roomId=${activeRoomId}`);
    }
  };

  // ================== Hooks ==================
  /**
   * Gets the most recent room on initialization.
   */
  useEffect(() => {
    handleCheckMostRecentRoom();
  }, []);

  // ====== Render ======
  return (
    <HomeComponent>
      {!!activeRoomId && <ActiveRoomComponent onJoin={handleJoinRoom} />}
      <MatchingSection>
        <h1>Find a Match</h1>
        <p>
          Welcome, {user.username}! Join a paired-programming session with a
          similarlly skilled programmer
        </p>
        <MatchingPage />
      </MatchingSection>
    </HomeComponent>
  );
}
export default Home;
