import { PendingMatch } from '../interfaces/pending-match';
import {
    createPendingMatch,
    deletePendingMatch,
    match
} from './repository';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreatePendingMatch(userId: string, socketId: string) {
    const pendingMatch = await createPendingMatch({ userId, socketId });
    pendingMatch.save();
    return pendingMatch.toObject() as PendingMatch;
}

export async function ormDeletePendingMatch(socketId: string) {
    return deletePendingMatch({ socketId });
}

export async function ormMatch(pendingMatch: PendingMatch) {
    const { _id } = pendingMatch;
    const newMatch = await match({
        '_id': { $ne: _id }, // Exclude pending match's id from matches
    });
    return newMatch as any;
}


