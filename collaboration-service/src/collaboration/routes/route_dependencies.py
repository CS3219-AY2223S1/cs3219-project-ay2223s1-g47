from src.collaboration.exceptions import AuthenticationException
from fastapi import Cookie
from src.api.user_service_api import UserServiceApiHandler
from src.api.api_handler import ApiHandler

async def jwt_auth(token: str = Cookie(None)):
    """
    Decode a JWT into user data.
    """
    # decode
    if not token: 
        # empty, throw exception
        raise AuthenticationException("No token provided.")

    # ping user service to auth
    user = await UserServiceApiHandler().auth_jwt_cookie(token)
    return user
