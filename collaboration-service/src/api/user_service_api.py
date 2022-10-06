from src.constants import USER_SERVICE_HOST, USER_SERVICE_JWT_AUTH_ENDPOINT
from src.api.api_handler import ApiHandler
from src.collaboration.interfaces.user import User

class UserServiceApiHandler:
    def __init__(self, _api_handler: ApiHandler):
        self.handler = _api_handler or ApiHandler(USER_SERVICE_HOST)
    
    async def auth_jwt_cookie(self, jwt_cookie: str) -> User:
        """
        Authenticates a user with a JWT cookie.
        """
        response = await self.handler._post(endpoint=USER_SERVICE_JWT_AUTH_ENDPOINT, data={"jwt": jwt_cookie})
        return User(**response)
    


    

    