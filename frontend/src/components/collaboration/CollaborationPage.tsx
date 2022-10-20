import { useContext, useEffect, useState } from "react";
import { ChatMessage, Room } from "../../interfaces/collaboration/Room";
import { apiGetRoom } from "../../api/CollaborationServiceApi";
import useIsMobile from "../../hooks/useIsMobile";
import { useSearchParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import userEvent from "@testing-library/user-event";
import styled from "styled-components";
import { TextField } from "../TextField";

const Grid = styled.div`
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  grid-template-areas: "heading editor editor"
                       "chat editor editor"
                       "chat editor editor";
  grid-template-columns: 20rem 1fr;
`;

const ChatBox =  styled.div`
  display: grid;
  grid-area: chat;
  grid-row-gap: 2rem;
  grid-template-rows: 1fr auto;
`;

const EditorBox = styled.div`
  grid-area: editor;
`;

const ChatList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const Chat = styled.li`
  margin: ${(props: any) => props.primary ? "0 0 2rem 2rem" : "0 2rem 2rem 0" };

  .chat-msg {
    background: ${(props: any) => props.primary ? "rgb(46, 137, 255)" : "none" };
    border-radius: ${(props: any) => props.primary ? "1rem 1rem 0 1rem" : "1rem 1rem 1rem 0" };
    box-shadow: ${(props: any) => props.primary ? "1px 1px 10px 5px rgba(34, 0, 224, .5)" : "-1px -1px 3px 1px rgba(63, 63, 74, 1), 5px 5px 15px 5px rgba(0, 0, 0, .2)"};
    margin: .5rem 0;
    padding: 1rem;
  }

  .chat-from {
    font-weight: bold;
    font-size: .9em;
    margin: 0 0 0 1rem;
  }

  .chat-time {
    color: #aaa;
    font-size: .9em;
    margin: ${(props: any) => props.primary ? "0 1rem 0 0" : "0 0 0 1rem" };
    text-align: ${(props: any) => props.primary ? "right" : "left" };
  }
` as any;

const Question = styled.h1`
  color: rgb(255, 179, 117);
  font-size: 2rem;
  grid-area: heading;
  margin: 0;
  text-shadow: 5px 2px 20px rgba(255, 90, 8, .8);
`;

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
  const debouncedCode = useDebounce(code, 500); // debounce code for half second

  // chat
  const [chatText, setChatText] = useState("");
  const chatMessageList = room?.state.chatHistory || [];

  // =============== functions =================
  const handleChatSendMessage: (text: string) => void = (text: string) => {
    console.log("called");
    // update room state for chat history via appending
    // hook will handle update
    room?.state.chatHistory.push({
      message: chatText,
      username: user.username,
      id: user.userId,
      timestamp: new Date().toISOString(),
    });

    if (!!room && !!webSocket && webSocket.readyState === 1) {
      webSocket.send(JSON.stringify(room.state));
      // clear chat message
      setChatText("");
    }
  };

  // =========== hooks =========================
  /**
   * Hook that initializes the room state.
   */
  useEffect(() => {
    // get and set room by api call
    apiGetRoom(roomId).then((response) => {
      if (response.status === 200) {
        const roomFromResponse: Room = {
          roomId: response.data.room_id ?? "",
          createdAt: response.data.created_at ?? "",
          closedAt: response.data.closed_at ?? "",
          isClosed: response.data.is_closed ?? false,
          state: {
            chatHistory: response.data.state?.chat_history ?? [],
            code: response.data.state?.code ?? "",
          },
          numInRoom: response.data.num_in_room ?? 1,
          question: {
            qid: response.data.question?.qid ?? "",
            title: response.data.question?.title ?? "",
            description: response.data.question?.description ?? "",
            difficulty: response.data.question?.difficulty ?? 0,
            topic: response.data.question?.topic ?? 0,
          },
        };
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
  }, [room, debouncedCode, room?.state.chatHistory, webSocket, socketJwt]);

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
        const roomFromResponse: Room = {
          roomId: updatedRoom.room_id ?? "",
          createdAt: updatedRoom.created_at ?? "",
          closedAt: updatedRoom.closed_at ?? room?.closedAt,
          isClosed: updatedRoom.is_closed ?? room?.isClosed,
          state: {
            chatHistory:
              updatedRoom.state?.chat_history ?? room?.state.chatHistory,
            code: updatedRoom.state?.code ?? room?.state.code,
          },
          numInRoom: updatedRoom.num_in_room ?? 1,
          question: {
            qid: updatedRoom.question?.qid ?? room?.question.qid,
            title: updatedRoom.question?.title ?? room?.question.title,
            description:
              updatedRoom.question?.description ?? room?.question.description,
            difficulty:
              updatedRoom.question?.difficulty ?? room?.question.difficulty,
            topic: updatedRoom.question?.topic ?? room?.question.topic,
          },
        };

        // 2. if not the same, then update
        if (updatedRoom !== room) {
          console.log("updating");
          setRoom(roomFromResponse);
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
  );

  const chatMessageListComponent = chatMessageList.map(
    (chatMessage: ChatMessage, index: number) => {
      return (
        <Chat key={index} primary={chatMessage.id === user.userId}>
          <div className="chat-from">{chatMessage.id === user.userId ? "You" : chatMessage.username}</div>
          <div className="chat-msg">{chatMessage.message}</div>
          <div className="chat-time">{chatMessage.timestamp}</div>
        </Chat>
      );
    }
  );

  /**
   * Chat component
   */
  const chatWindowComponent = (
    <ChatBox>
      <ChatList>
        {chatMessageListComponent}
      </ChatList>
      <div>
          <TextField
            label="Message"
            type="text"
            value={chatText}
            onChange={(event) => setChatText(event.target.value)}
            onKeyDown={(event) => {
              const ENTER_KEY_CODE = 13;
              if (event.keyCode === ENTER_KEY_CODE) {
                handleChatSendMessage(chatText);
              }
            }}
          />
      </div>
      </ChatBox>
  );

  /**
   * Question component
   */
  const questionComponent = (
    <Question>{room?.question.title}</Question>
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

  const roomIsOpenComponent = (
    <Grid>
      {questionComponent}
      {chatWindowComponent}
      <EditorBox>
        {codeEditorComponent}
      </EditorBox>
    </Grid>
  );

  const toShow = room?.isClosed ? roomIsClosedComponent : roomIsOpenComponent;

  return toShow;
}

export default CollaborationPage;
