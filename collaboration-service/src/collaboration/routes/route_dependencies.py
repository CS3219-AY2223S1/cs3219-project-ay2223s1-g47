from src.collaboration.exceptions import AuthenticationException
from fastapi import Cookie, Query
from src.api.user_service_api import UserServiceApiHandler

async def jwt_auth_from_cookie(jwt: str = Cookie(None)):
    """
    Decode a JWT into user data.
    """
    return await jwt_auth(jwt)

async def jwt_auth_from_query(jwt: str = Query(default="")):
    return await jwt_auth(jwt)

async def jwt_auth(jwt: str):
    """
    Decode a JWT into user data.
    """
    # decode
    print("Decoding jwt", jwt)

    if not jwt: 
        # empty, throw exception
        raise AuthenticationException("No token provided.")

    # ping user service to auth
    user = await UserServiceApiHandler().auth_jwt_cookie(jwt)
    return user