import { ormCreateUser as _createUser } from '../model/user-orm.js'
import { ormLogin as _login } from '../model/user-orm.js'

export async function createUser(req, res) {
    try {
        //password salt and hash here
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            } else if (resp == false){
                return res.status(400).json({message: 'Could not create a new user!'});
            } else{
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function login(req, res) {
    try {
        //password salt and hash here
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _login(username, password);
            console.log(resp);

            if (resp == null) {
                console.log(`no match found`)
                return res.status(401).json({message: 'Invalid credentials!'});
                
            } else if (resp.err) {
                return res.status(400).json({message: 'Could not login!'});
            } else {
                console.log(`Successful login as ${username} !`)
                return res.status(201).json({message: `Successful login as ${username} !`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when logging in!'})
    }
}
