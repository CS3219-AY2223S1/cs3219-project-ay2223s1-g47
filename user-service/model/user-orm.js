import { createUser } from './repository.js';
import { login } from './repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
/*
    ORM stands for object-relational mapping, 
    where objects are used to connect the programming language on to the database systems, 
    with the facility to work SQL and object-oriented programming concepts
*/


export async function ormCreateUser(username, password) {
    try {
        const newUser = await createUser({username, password});
        if( newUser != null){
            newUser.save();
        return true;
        }
        return false;
    } catch (err) {
        console.log('ERROR: Could not create new user');
        return { err };
    }
}

export async function ormLogin(username, password) {
    try {
        const success = await login({username, password});
        return success;
    } catch (err) {
        console.log('ERROR: Could not find user/password');
        return { err };
    }
}

