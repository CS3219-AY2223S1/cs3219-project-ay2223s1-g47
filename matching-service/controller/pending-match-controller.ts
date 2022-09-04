import { PendingMatch } from '../interfaces/pending-match.js';
import {
    ormCreatePendingMatch as _createPendingMatch,
    ormDeletePendingMatch as _deletePendingMatch,
    ormMatch as _match
} from '../model/pending-match-orm'

const isValidPendingMatchInput = (socketId: string) => {
    if (!socketId) return false;
    return true;
};

export async function createPendingMatch(userId: string, socketId: string) {
    if (!isValidPendingMatchInput(socketId)) {
        console.log('Invalid pending match input!');
    }

    return _createPendingMatch(userId, socketId);
}

export async function deletePendingMatch(socketId: string) {
    try {
        if (!isValidPendingMatchInput(socketId)) {
            console.log('Invalid pending match input!');
        }

        _deletePendingMatch(socketId);
    } catch (err) {
        console.log('Database failure when creating new pending match!');
    }
}

export async function match(pendingMatch: PendingMatch) {
    return _match(pendingMatch);
}
