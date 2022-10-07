import { useContext, useEffect, useState } from "react";
import { Room } from "../../interfaces/collaboration/Room";
import { apiGetRoom } from "../../api/CollaborationServiceApi";
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
import { Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

function CollaborationPage() {
  // =========== query params ==================
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") as string;

  // =========== state management ==============

  // history
  const navigate = useNavigate();

  // context
  const { webSocket, createWebSocket, clearWebSocket } = useContext(
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

  // chat
  const [chat, setChat] = useState("");

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
            questionId: response.data.question?.question_id ?? "",
            question: response.data.question?.question ?? "",
            answer: response.data.question?.answer ?? "",
            difficulty: response.data.question?.difficulty ?? 0,
            questionResourceUris:
              response.data.question?.question_resource_uris ?? [],
            answerResourceUris:
              response.data.question?.answer_resource_uris ?? [],
            createdAt: response.data.question?.created_at ?? "",
          },
        };
        setRoom(roomFromResponse);
        setCode(roomFromResponse.state.code);
      } else {
        console.log(response);
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
  }, [room?.state, code, webSocket, socketJwt]);

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
            questionId:
              updatedRoom.question?.question_id ?? room?.question.questionId,
            question: updatedRoom.question?.question ?? room?.question.question,
            answer: updatedRoom.question?.answer ?? room?.question.answer,
            difficulty:
              updatedRoom.question?.difficulty ?? room?.question.difficulty,
            questionResourceUris:
              updatedRoom.question?.question_resource_uris ??
              room?.question.questionResourceUris,
            answerResourceUris:
              updatedRoom.question?.answer_resource_uris ??
              room?.question.answerResourceUris,
            createdAt:
              updatedRoom.question?.created_at ?? room?.question.createdAt,
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
          fontSize: 12,
          outline: 0,
          boxShadow: "none",
          minHeight: "100%",
        }}
        tabSize={4}
      />
    </Box>
  );

  /**
   * Chat component
   */
  const chatComponent = <div></div>;

  /**
   * Question component
   */
  const questionComponent = <div>Question</div>;

  return (
    <Grid container minHeight={"100vh"}>
      <Grid item xs={4}>
        {questionComponent}
      </Grid>
      <Grid item xs={8}>
        {codeEditorComponent}
      </Grid>
    </Grid>
  );
}

export default CollaborationPage;
