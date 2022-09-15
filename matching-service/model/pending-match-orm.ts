import { Types } from 'mongoose';
import { PendingMatch } from '../interfaces/pending-match';
import {
    createPendingMatch,
    deletePendingMatch,
    match
} from './repository';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreatePendingMatch(
    userId: string,
    socketId: string,
    difficulty: number
) {
    const pendingMatch: PendingMatch = await createPendingMatch({
        userId: new Types.ObjectId(userId),
        socketId,
        difficulty, 
    });
    pendingMatch.save();
    return pendingMatch;
}

export async function ormDeletePendingMatch(socketId: string) {
    return deletePendingMatch({ socketId: new Types.ObjectId(socketId) });
}

export async function ormMatch(pendingMatch: PendingMatch) {
    const { _id, difficulty } = pendingMatch;
    const newMatch: PendingMatch | null = await match({
        '_id': { $ne: _id }, // Exclude pending match's id from matches
        difficulty, // Only include matches with same difficulty
    });
    return newMatch;
}


