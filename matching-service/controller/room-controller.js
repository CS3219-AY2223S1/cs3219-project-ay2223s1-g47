import { ormCreateRoom as _createRoom } from '../model/room-orm.js'

const isValidRoomInput = (users) => {
    if (!users) return false;
    return true;
};

export async function createRoom(users) {
    try {
        if (!isValidRoomInput(users)) {
            return res.status(400).json({message: 'Invalid room input!'});
        }

        const resp = await _createRoom(users);
        if (resp.err) {
            console.log('Could not create a new room!');
        }

        console.log(`Created new room!`);
    } catch (err) {
        console.log('Database failure when creating new room!');
    }
}
