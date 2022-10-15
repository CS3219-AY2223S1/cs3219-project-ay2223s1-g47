import axios from "axios";

/**
 * Create room with specified users and difficulty.
 * @param userId1 
 * @param userId2 
 * @param difficulty
 * @returns string room id
 */
export const createRoom = async (userId1: string, userId2: string, difficulty: number) => {
    const collabUri = process.env.COLLABORATION_SERVICE_URI
            || "http://localhost:8003";
    const res = await axios.post(collabUri + "/crud/create", {
        user1_id: userId1,
        user2_id: userId2,
        difficulty,
    });
    if (res.status == 200) {
        return res.data;
    }
    return;
}