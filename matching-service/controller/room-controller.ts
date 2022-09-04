import { ormCreateRoom as _createRoom } from '../model/room-orm';

const isValidRoomInput = (users: string[]) => {
    if (!users) return false;
    return true;
};

export async function createRoom(users: string[]) {
    return await _createRoom(users);
}
