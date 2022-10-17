import { useContext, useEffect, useState } from "react";
import { Room } from "../../interfaces/collaboration/Room";
import {
  apiGetRoom,
  convertRoomApiResponseToRoom,
} from "../../api/CollaborationServiceApi";
import useIsMobile from "../../hooks/useIsMobile";
import { useSearchParams } from "react-router-dom";
import Editor from "react-simple-code-editor";

import { highlight, Grammar, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

import { UserContext, UserContextType } from "../../contexts/UserContext";
import { apiGetNewJwt } from "../../api/UserServiceApi";
import { COLLABORATION_SERVICE_COLLABRATION_ROOM_URL } from "../../constants";
import {
  Avatar,
  Button,
  Card,
  CardActions,
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
import userEvent from "@testing-library/user-event";

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

  // auth state
  const [socketJwt, setSocketJwt] = useState<string>("");

  // UI states
  // mobile
  const isMobile = useIsMobile();

  // errors
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState("");

  // code editor language and code
  const [codeLanguage, setCodeLanguage] = useState<{
    languageGrammer: Grammar;
    language: string;
  }>({ languageGrammer: languages.js, language: "js" });
  const [code, setCode] = useState("");
  const debouncedCode = useDebounce(code, 200); // debounce code for half second

  // =============== functions =================

  // =========== hooks =========================
  /**
   * Hook that initializes the room state.
   */
  useEffect(() => {
    // get and set room by api call
    apiGetRoom(roomId).then((response) => {
      if (response.status === 200) {
        const roomFromResponse: Room = convertRoomApiResponseToRoom(
          response.data
        );
        setRoom(roomFromResponse);
        setCode(roomFromResponse.state.code);
      } else {
        console.error(response);
        navigate("/match");
        const errorMessage =
          response.detail.message ??
          "Something went wrong! Please try again later.";
        setErrorSnackbarContent(errorMessage);
        console.log(errorMessage);
        setIsErrorSnackbarOpen(true);
      }
    });
  }, [roomId]);

  /**
   * Hook that updates the room state via the websocket connection.
   */
  useEffect(() => {
    if (!!room && !!webSocket && webSocket.readyState === 1) {
      webSocket.send(JSON.stringify(room.state));
    }
  }, [room, debouncedCode, webSocket, socketJwt]);

  /**
   * Hook that initializes authentication in preparation for the websocket connection.
   * Specifically, it gets a new JWT for the websocket connection.
   */
  useEffect(() => {
    apiGetNewJwt().then((response) => {
      if (response.status === 200) {
        setSocketJwt(response.data.jwt);
      } else {
        setErrorSnackbarContent(
          "Something went wrong! Please try again later."
        );
        setIsErrorSnackbarOpen(true);
      }
    });
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
        if (roomFromResponse.state.code !== code) {
          console.log("updating code");
          setCode(roomFromResponse.state.code);
        }
      };
    }
  }, [webSocket]);

  // =========== components ====================

  /**
   * Code editor
   */
  const codeEditorComponent = (
    <Box
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Editor
        value={code}
        onValueChange={(code: string) => {
          setCode(code);
          if (room) {
            room.state.code = code;
            setRoom(room);
          }
        }}
        highlight={(code) =>
          highlight(code, codeLanguage.languageGrammer, codeLanguage.language)
        }
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          outline: 0,
          boxShadow: "none",
          minHeight: "100%",
        }}
        tabSize={4}
      />
    </Box>
  );

  /**
   * Question component
   */
  const questionComponent = (
    <Grid container component={Paper}>
      <Grid item xs={12} padding={"12px"}>
        <Typography variant="h4">{room?.question.title}</Typography>
      </Grid>
      <Grid item xs={12}></Grid>
    </Grid>
  );

  /**
   * Room is closed component
   */
  const roomIsClosedComponent = (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card elevation={24} style={{ padding: "24px", borderRadius: "12px" }}>
        <Typography variant="h2">Room is closed</Typography>
        <CardActions>
          <Button onClick={() => navigate("/match")}>
            <Typography>Return to matching page</Typography>
          </Button>
        </CardActions>
      </Card>
    </Box>
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
          <Grid item xs={12}>
            dummy
          </Grid>
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
