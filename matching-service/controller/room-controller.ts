import { MissingInputError } from '../interfaces/error';
import { ormCreateRoom as _createRoom } from '../model/room-orm';
import { checkValidators } from '../utils/validator';

const MISSING_USERS_MSG = "Must specify users to add to room."

const validateUsers = (users: string[]) => {
    if (!users) throw new MissingInputError(MISSING_USERS_MSG);
};

const validators = [
    validateUsers,
]

export async function createRoom(users: string[], difficulty: number) {
    checkValidators(users, validators);
    return await _createRoom(users, difficulty);
}
