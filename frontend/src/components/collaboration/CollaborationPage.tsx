import { useContext, useEffect, useState } from "react";
import { Room } from "../../interfaces/collaboration/Room";
import {
  apiGetRoom,
  convertRoomApiResponseToRoom,
} from "../../api/CollaborationServiceApi";
import useIsMobile from "../../hooks/useIsMobile";
import { useSearchParams } from "react-router-dom";

import { UserContext, UserContextType } from "../../contexts/UserContext";
import { apiGetNewJwt } from "../../api/UserServiceApi";
import { COLLABORATION_SERVICE_COLLABRATION_ROOM_URL } from "../../constants";
import {
  Divider,
  FormControl,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";

import RealTimeCollaborativeEditor from "./RealTimeCollaborativeEditor";

function CollaborationPage() {
  // =========== query params ==================
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") as string;

  // =========== state management ==============

  // history
  const navigate = useNavigate();

  // context
  const { user, webSocket, createWebSocket, clearWebSocket } = useContext(
    UserContext
  ) as UserContextType;

  // room data
  const [room, setRoom] = useState<Room | undefined>(undefined);
  const [initialCode, setInitialCode] = useState<string | undefined>(undefined); // for initial code to populate editor

  // auth state
  const [socketJwt, setSocketJwt] = useState<string>("");

  // UI states
  // mobile
  const isMobile = useIsMobile();

  // code state
  const [code, setCode] = useState<string>(""); // for tracking code changes
  const debouncedCode = useDebounce(code, 500); // debounce code for half second for debounced updates

  // =============== functions =================
  /**
   * Handles socket jwt auth by requesting a new jwt from the backend
   * and then setting the state.
   */
  const handleJwtSocketAuth = () => {
    apiGetNewJwt().then((response) => {
      if (response.status === 200) {
        setSocketJwt(response.data.jwt);
      } else {
        // TODO: error notifcation
      }
    });
  };

  /**
   * Handles room initialization by making an API call to the backend
   * to get the room, from the room id, then sets the state.
   */
  const handleRoomInitialization = (roomId: string) => {
    // get and set room by api call
    apiGetRoom(roomId).then((response) => {
      if (response.status === 200) {
        // 1. convert
        const roomFromResponse: Room = convertRoomApiResponseToRoom(
          response.data
        );

        // 2. set states
        setRoom(roomFromResponse);
        setCode(roomFromResponse.state.code);
        setInitialCode(roomFromResponse.state.code);
      } else {
        console.error(response);
        navigate("/match");
        const errorMessage =
          response.detail.message ??
          "Something went wrong! Please try again later.";

        // TODO: error notification
      }
    });
  };

  /**
   * Handle room update by posting to the websocket connection
   * a json string of the room.
   */
  const handleRoomUpdate = (
    room?: Room,
    debouncedCode?: string,
    webSocket?: WebSocket | null,
    socketJwt?: string
  ) => {
    if (room && debouncedCode && webSocket && socketJwt) {
      room.state.code = debouncedCode;

      // stringify and send room state
      webSocket.send(JSON.stringify(room.state));
    }
  };

  // =========== hooks =========================
  /**
   * Hook that initializes the room state.
   */
  useEffect(() => {
    handleRoomInitialization(roomId);
  }, [roomId]);

  /**
   * Hook that updates the room state via the websocket connection.
   */
  useEffect(() => {
    handleRoomUpdate(room, debouncedCode, webSocket, socketJwt);
  }, [room, debouncedCode, webSocket, socketJwt]);

  /**
   * Hook that initializes authentication in preparation for the websocket connection.
   * Specifically, it gets a new JWT for the websocket connection.
   */
  useEffect(() => {
    handleJwtSocketAuth();
  }, []);

  /**
   * Hook that initializes the socket with the collaboration service.
   */
  useEffect(() => {
    console.log("initializing socket");
    clearWebSocket();
    if (room && socketJwt) {
      createWebSocket(
        "ws://" +
          COLLABORATION_SERVICE_COLLABRATION_ROOM_URL +
          "?room_id=" +
          room?.roomId +
          "&jwt=" +
          socketJwt
      );
    }
  }, [socketJwt, room?.roomId, socketJwt]);

  /**
   * Hook that listens for updates to the room state from the socket.
   */
  useEffect(() => {
    if (webSocket) {
      webSocket.onmessage = (event) => {
        // 1. set room state
        const updatedRoom = JSON.parse(event.data);
        const roomFromResponse: Room =
          convertRoomApiResponseToRoom(updatedRoom);

        // 2. if not the same, then update
        if (roomFromResponse !== room) {
          console.log("updating");
          setRoom(roomFromResponse);
        }

        // 3. event logging
        // TODO: event notification
      };
    }
  }, [webSocket]);

  // =========== components ====================

  /**
   * Code editor
   */
  const codeEditorComponent = (
    <RealTimeCollaborativeEditor
      roomId={roomId}
      username={user.username}
      userId={user.userId}
      language={"python"} // TODO: not hard code this
      initialCode={initialCode ?? ""}
      codeCallback={(code: string) => {
        setCode(code);
      }}
    />
  );

  /**
   * Question component
   */
  const questionComponent = (
    <Grid container component={Paper} direction={"column"}>
      <Grid item xs={12} padding={"12px"}>
        <Typography variant="h4">{room?.question.title}</Typography>
      </Grid>
      <Grid item xs={12} padding={"12px"}>
        <Typography variant="body1">{room?.question.description}</Typography>
      </Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  );

  const roomComponent = (
    <Grid container direction="row" justifyContent="space-evenly">
      <Grid item xs={4}>
        <Grid
          container
          direction="column"
          justifyContent="space-evenly"
          spacing={12}
        >
          <Grid item xs={12}>
            {questionComponent}
          </Grid>
          <Divider />
        </Grid>
      </Grid>
      <Grid item xs={8}>
        {codeEditorComponent}
      </Grid>
    </Grid>
  );

  return roomComponent;
}

export default CollaborationPage;
