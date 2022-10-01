import { changePassword } from "./repository.js";
import { createUser } from "./repository.js";
import { login } from "./repository.js";
import { deleteUser } from "./repository.js";
import { existsUser } from "./repository.js";
import { getUserId } from "./repository.js";

//need to separate orm functions from repository to decouple business logic from persistence
/*
    ORM stands for object-relational mapping, 
    where objects are used to connect the programming language on to the database systems, 
    with the facility to work SQL and object-oriented programming concepts
*/

export async function ormLogin(username, password) {
  try {
    const success = await login({ username, password });
    return success;
  } catch (err) {
    console.log("ERROR: Could not find user/password");
    return { err };
  }
}

export async function ormDeleteUser(username) {
  try {
    if (!(await existsUser({ username }))) {
      return false;
    }
    const success = await deleteUser({ username });
    return success;
  } catch (err) {
    console.log("ERROR: Could not find user");
    return { err };
  }
}

export async function ormChangePassword(username, password) {
  try {
    if (!(await existsUser({ username }))) {
      return false;
    }
    const success = await changePassword({ username, password });
    return success;
  } catch (err) {
    console.log(err);
    console.log("ERROR: Could not find user");
    return { err };
  }
}

export async function ormGetId(username) {
  try {
    return await getUserId({ username });
  } catch (err) {
    console.log(err);
    console.log("ERROR: Could not find user");
    return { err };
  }
}
