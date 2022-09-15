export function unauthorized(res){
    return res.status(401).json({ message: 'Unauthorized' })
}

export function databaseError(res){
    return res.status(500).json({ message: 'Database failure' })
}

export function missingCredentialResponse(res){
    return res.status(400).json({ message: 'Username and/or Password are missing!' })
}