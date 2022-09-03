import {
    ormCreatePendingMatch as _createPendingMatch,
    ormMatch as _match
} from '../model/pending-match-orm.js'

const isValidPendingMatchInput = (socketId) => {
    if (!socketId) return false;
    return true;
};

export async function createPendingMatch(userId, socketId) {
    try {
        if (!isValidPendingMatchInput(socketId)) {
            console.log('Invalid pending match input!');
        }

        const resp = await _createPendingMatch(userId, socketId);
        if (resp.err) {
            console.log('Could not create a new pending match!');
        }

        console.log(`Created new pending match!`);
    } catch (err) {
        console.log('Database failure when creating new pending match!');
    }
}

export async function deletePendingMatch(socketId) {
    try {
        if (!isValidPendingMatchInput(socketId)) {
            console.log('Invalid pending match input!');
        }

        const resp = await _deletePendingMatch(socketId);
        if (resp.err) {
            console.log('Could not create a new pending match!');
        }

        console.log(`Created new pending match!`);
    } catch (err) {
        console.log('Database failure when creating new pending match!');
    }
}

export async function match(pendingMatch) {
    const match = _match(pendingMatch);
}
