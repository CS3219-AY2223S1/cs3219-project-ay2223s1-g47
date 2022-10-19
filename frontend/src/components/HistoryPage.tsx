import { useEffect, useState } from "react";
import { apiGetRoomHistory, RoomApiResponseData } from "../api/CollaborationServiceApi"

export function HistoryPage() {
    const [rooms, setRooms] = useState<RoomApiResponseData[]>();
    
    const getRoomHistory = async () => {
        const response = await apiGetRoomHistory();
        if (response.status >= 200 && response.status < 300) {
          if (response.data) {
            // We might want to make some calls to user service to get the username
            setRooms(response.data);
          }
        }
    }
    
    useEffect(() => {
        getRoomHistory();
    }, []);

    return<>
        <h1>Match History</h1>
        {rooms?.map((room: any) => {
            return <>Some room</>
        })}
    </>
}