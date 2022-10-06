import { useEffect, useState } from "react";
import { Room } from "../../interfaces/collaboration/Room";
import { apiGetRoom } from "../../api/CollaborationServiceApi";
import useIsMobile from "../../hooks/useIsMobile";
import { useSearchParams } from "react-router-dom";

import Editor from "react-simple-code-editor";

import { highlight, Grammar, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";

function CollaborationPage() {
  // =========== query params ==================
  const [searchParams, setSearchParams] = useSearchParams();
  const roomId = searchParams.get("roomId") as string;

  // =========== state management ==============

  // room data
  const [room, setRoom] = useState<Room | undefined>(undefined);

  // UI states
  const isMobile = useIsMobile();
  const [isErrorSnackbarOpen, setIsErrorSnackbarOpen] = useState(false);
  const [errorSnackBarContent, setErrorSnackbarContent] = useState("");
  const [codeLanguage, setCodeLanguage] = useState<{
    languageGrammer: Grammar;
    language: string;
  }>({ languageGrammer: languages.python, language: "py" });
  const [code, setCode] = useState("");

  // =========== hooks =========================
  /**
   * Hook that initializes the room state.
   */
  useEffect(() => {
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
      } else {
        const errorMessage =
          response.detail.message ??
          "Something went wrong! Please try again later.";
        setErrorSnackbarContent(errorMessage);
        console.log(errorMessage);
        setIsErrorSnackbarOpen(true);
      }
    });
  }, [roomId]);

  // =========== components ====================
  const codeEditorComponent = (
    <Editor
      value={code}
      onValueChange={(code: string) => {
        setCode(code);
        if (room) {
          room.state.code = code;
          setRoom(room);
          console.log("set room");
        }
      }}
      highlight={(code) => highlight(code, languages.js, "js")}
      padding={10}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
      }}
      tabSize={4}
    />
  );
  const chatComponent = <div></div>;
  const questionComponent = <div></div>;
  console.log(room);
  console.log(roomId);

  return <div>{codeEditorComponent}</div>;
}

export default CollaborationPage;
