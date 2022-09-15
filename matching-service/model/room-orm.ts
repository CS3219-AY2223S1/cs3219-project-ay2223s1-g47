import { Types } from 'mongoose';
import { Room } from '../interfaces/room';
import { createRoom } from './repository';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateRoom(userIds: string[], difficulty: number) {
    const newRoom = await createRoom({
        userIds: userIds.map(userId => new Types.ObjectId(userId)),
        difficulty,
    });
    newRoom.save();
    return newRoom.toObject() as Room;
}
