import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  apiGetRoomHistory,
  convertRoomApiResponseToRoom,
  RoomApiResponseData,
} from "../api/CollaborationServiceApi";
import { UserContext, UserContextType } from "../contexts/UserContext";
import { Room } from "../interfaces/collaboration/Room";

const HistoryComponent = styled.div`
  h1 {
    color: rgb(255, 179, 117);
    margin: 0 0 2rem 0;
    text-align: center;
    text-shadow: 5px 2px 20px rgba(255, 90, 8, 0.8);
  }
`;

const Stats = styled.div`
  display: grid;
  grid-column-gap: 3rem;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 3rem 0;
`;

const Counter = styled.div`
  border-radius: 20px;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.4),
    -5px -5px 15px 5px rgba(63, 63, 74, 1);
  padding: 2rem;
  text-align: center;

  div:first-of-type {
    color: rgb(255, 179, 117);
    font-size: 3rem;
    font-weight: bold;
    margin: 0 0 2rem 0;
    text-shadow: 5px 2px 20px rgba(255, 90, 8, 0.8);
  }

  div:last-of-type {
    font-weight: bold;
  }
`;

const RoomList = styled.ul`
  border-radius: 20px;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, 0.4),
    -5px -5px 15px 5px rgba(63, 63, 74, 1);
  list-style-type: none;
  padding: 2rem;

  li {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    margin: 1rem 0 0 0;
  }

  li:first-of-type {
    color: rgb(255, 179, 117);
    font-weight: bold;
    margin: 0;
    text-shadow: 5px 2px 20px rgba(255, 90, 8, 0.8);
  }
`;

const difficultyMap = ["Easy", "Medium", "Hard"];

export function HistoryPage() {
  const { user } = useContext(UserContext) as UserContextType;
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
    return <li>
      <div>{ room.createdAt }</div>
      <div>{ room.question.title }</div>
      <div>{ difficultyMap[room.question.difficulty] }</div>
      <div>{ room.roomId }</div>
    </li>;
  };

  /**
   * List of rooms
   */
  const roomComponentList = (
    <RoomList>
      <li>
        <div>Created At</div>
        <div>Question</div>
        <div>Difficulty</div>
        <div>Room Id</div>
      </li>
      {rooms?.map((room: Room) => {
        return roomComponentListItem(room);
      })}
    </RoomList>
  );

  /**
   * Display when there are no rooms
   */
  const noRooms = <div>You've not had any session </div>;

  return (
    <HistoryComponent>
      <h1>Match History</h1>
      <Stats>
        {difficultyMap.map((difficulty, key) => {
          return <Counter>
            <div>{rooms.filter(room => room.question.difficulty == key).length}</div>
            <div>{ difficulty }</div>
          </Counter>
        })}
      </Stats>
      {rooms.length > 0 ? roomComponentList : noRooms}
    </HistoryComponent>
  );
}
