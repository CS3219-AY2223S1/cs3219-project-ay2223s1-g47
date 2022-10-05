import { User } from "../../interfaces/users/User";
import { useEffect, useState } from "react";
import { Room } from "../../interfaces/collaboration/Room";
import { apiGetRoom } from "../../api/collaborationServiceApi";
import useIsMobile from "../../hooks/useIsMobile";
import { useSearchParams } from "react-router-dom";

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
          response.data.message ??
          "Something went wrong! Please try again later.";
        setErrorSnackbarContent(errorMessage);
        setIsErrorSnackbarOpen(true);
      }
    });
  }, [roomId]);

  // =========== components ====================
  const codeEditorComponent = <div></div>;
  const chatComponent = <div></div>;
  const questionComponent = <div></div>;

  return <div></div>;
}

export default CollaborationPage;
