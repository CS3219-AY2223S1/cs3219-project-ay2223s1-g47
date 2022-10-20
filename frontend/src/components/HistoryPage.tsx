import { useEffect, useState } from "react";
import {
  apiGetRoomHistory,
  convertRoomApiResponseToRoom,
  RoomApiResponseData,
} from "../api/CollaborationServiceApi";
import { Room } from "../interfaces/collaboration/Room";

export function HistoryPage() {
  // ================ state management ================
  const [rooms, setRooms] = useState<Room[]>([]);

  // ================= functions =================
  /**
   * Gets the room history by making an API call.
   */
  const handleGetRoomHistory = async () => {
    const response = await apiGetRoomHistory();
    if (response.status >= 200 && response.status < 300) {
      if (response.data) {
        console.log(response);
        // TODO: error logging/snackbar
        const data = response.data as RoomApiResponseData[];
        const rooms = data.map((room) => {
          return convertRoomApiResponseToRoom(room);
        });
        setRooms(rooms);
      }
    }
  };

  // =================== hooks ====================
  /**
   * Gets the room history on initialization.
   */
  useEffect(() => {
    handleGetRoomHistory();
  }, []);

  // =================== render ===================
  /**
   * A given room card.
   */
  const roomComponentListItem = (room: Room) => {
    return <>Some room</>;
  };

  /**
   * List of rooms
   */
  const roomComponentList = (
    <li>
      {rooms?.map((room: Room) => {
        return roomComponentListItem(room);
      })}
    </li>
  );

  /**
   * Display when there are no rooms
   */
  const noRooms = <div>You've not had any session </div>;

  return (
    <>
      <h1>Match History</h1>
      {rooms.length > 0 ? roomComponentList : noRooms}
    </>
  );
}
