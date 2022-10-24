import { useContext, useEffect, useRef, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";

import RealTimeCollaborativeEditor from "./RealTimeCollaborativeEditor";
import styled from "styled-components";

const Grid = styled.div`
  display: grid;
  grid-column-gap: 2rem;
  grid-row-gap: 2rem;
  grid-template-areas: 'question editor editor'
                       'video editor editor';
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto 1fr;
`;

const Video = styled.div`
  grid-area: video;

  iframe {
    min-height: 250px;
  }
`;

const Editor = styled.div`
  grid-area: editor;
`;

const Question = styled.div`
  grid-area: question;

  h1 {
    color: rgb(255, 179, 117);
    margin: 0 0 2rem 0;
    text-shadow: 5px 2px 20px rgba(255, 90, 8, 0.8);
  }
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
  const [initialCode, setInitialCode] = useState<string | undefined>(undefined); // for initial code to populate editor

  // auth state
  const [socketJwt, setSocketJwt] = useState<string>("");

  // UI states
  // mobile
  const isMobile = useIsMobile();

  // video call
  const [videoCallUrl, setVideoCallUrl] = useState<string | undefined>(
    undefined
  );

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
      console.log(response);
      if (response.status === 200) {
        // 1. convert
        const roomFromResponse: Room = convertRoomApiResponseToRoom(
          response.data
        );

        // 2. set states
        setRoom(roomFromResponse);
        setCode(roomFromResponse.state.code);
        setInitialCode(roomFromResponse.state.code);
        setVideoCallUrl(roomFromResponse.videoRoomUrl);
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
        COLLABORATION_SERVICE_COLLABRATION_ROOM_URL +
          "?room_id=" +
          room?.roomId +
          "&jwt=" +
          socketJwt
      );
    }
  }, [socketJwt, room?.roomId]);

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
          setRoom(roomFromResponse);
        }

        // 3. event logging
        // TODO: event notification
      };
    }
  }, [webSocket]);

  /**
   * Hook that handles video call rendering.
   */
  useEffect(() => {
    // 0. if video call url is undefined, cannot
    if (!videoCallUrl) {
      return;
    }

    // 1. create script to run video
    const script = document.createElement("script");
    script.innerHTML = `window.DailyIframe.createFrame(document.getElementById('callframe'), {
            iframeStyle: {
              width: "100%",
              height: "100%",
              border: "0",
              zIndex: 9999
            },
            showLeaveButton: true,
            showFullscreenButton: true,
          }).join({
            url: "${videoCallUrl}",
          });`;

    // 2. bind elements
    const videoRef = document.getElementById("video");
    const videoFrameRef = document.getElementById("callframe");
    if (videoRef && videoFrameRef && videoFrameRef.children.length === 0) {
      videoRef.appendChild(script);
    }
  }, [videoCallUrl]);

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
    <Question>
      <h1>{room?.question.title}</h1>
      <p>
        {room?.question.description}
      </p>
    </Question>
  );

  return (
    <Grid>
      {questionComponent}
      <Editor>{codeEditorComponent}</Editor>
      <Video>
        <div id="callframe"></div>
        <div id="video"></div>
      </Video>
    </Grid>
  );
}

export default CollaborationPage;
