import { createRoom } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateRoom(userIds) {
    try {
        const newRoom = await createRoom({userIds});
        newRoom.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new room.');
        return { err };
    }
}
