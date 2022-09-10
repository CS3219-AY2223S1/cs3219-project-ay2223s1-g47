import { MissingInputError } from '../interfaces/error.js';
import { PendingMatch } from '../interfaces/pending-match.js';
import {
    ormCreatePendingMatch as _createPendingMatch,
    ormDeletePendingMatch as _deletePendingMatch,
    ormMatch as _match
} from '../model/pending-match-orm';
import { checkValidators } from '../utils/validator.js';

const MISSING_USER_MSG = "Must specify user for pending match.";
const MISSING_SOCKET_MSG = "Must specify socket for pending match.";

const validateUser = ({ userId }: { userId: string }) => {
    if (!userId) throw new MissingInputError(MISSING_USER_MSG);
};

const validateSocket = ({ socketId }: { socketId: string }) => {
    if (!socketId) throw new MissingInputError(MISSING_SOCKET_MSG);
};

export async function createPendingMatch(userId: string, socketId: string) {
    checkValidators({ userId, socketId }, [
        validateUser,
        validateSocket,
    ]);
    return _createPendingMatch(userId, socketId);
}

export async function deletePendingMatch(socketId: string) {
    checkValidators({ socketId }, [
        validateSocket,
    ]);
    _deletePendingMatch(socketId);
}

export async function match(pendingMatch: PendingMatch) {
    return _match(pendingMatch);
}