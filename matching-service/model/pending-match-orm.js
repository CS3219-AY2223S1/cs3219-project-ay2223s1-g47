import {
    createPendingMatch,
    deletePendingMatch,
    match
} from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreatePendingMatch(userId, socketId) {
    try {
        const newPendingMatch = await createPendingMatch({userId, socketId});
        newPendingMatch.save();
        return true;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormDeletePendingMatch(socketId) {
    try {
        await deletePendingMatch({socketId});
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormMatch(pendingMatch) {
    const {_id} = pendingMatch;
    try {
        return match({
            '_id': {$ne: _id}, // Exclude pending match's id from matches
        });
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}


