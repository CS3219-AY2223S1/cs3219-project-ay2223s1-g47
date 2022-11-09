from src.constants import USER_SERVICE_GET_USERNAME_ENDPOINT, USER_SERVICE_HOST, USER_SERVICE_JWT_AUTH_ENDPOINT
from src.api.api_handler import ApiHandler
from src.collaboration.interfaces.user import User

class UserServiceApiHandler:
    def __init__(self, _api_handler: ApiHandler=None):
        self.handler = _api_handler or ApiHandler(USER_SERVICE_HOST)
    
    async def auth_jwt_cookie(self, jwt_cookie: str) -> User:
        """
        Authenticates a user with a JWT cookie.
        """
        response = await self.handler._post(endpoint=USER_SERVICE_JWT_AUTH_ENDPOINT, data={"jwt": jwt_cookie})
        return User(**response)

    async def get_username(self, user_id: str) -> str: 
        """
        Gets a username from the user service.
        """
        response = await self.handler._get(endpoint=USER_SERVICE_GET_USERNAME_ENDPOINT, params={"id": user_id})

        return response["username"]
    


    

    