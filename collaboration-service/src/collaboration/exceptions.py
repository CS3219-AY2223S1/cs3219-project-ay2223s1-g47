from fastapi import HTTPException

class CollaborationServiceException(HTTPException):
    def __init__(self, status_code: int, message: str, detail: dict = None):
        super().__init__(status_code=status_code, detail=dict(message=message, detail=detail))
        

# ======================== Rooms ========================
class RoomConnectionException(CollaborationServiceException):
    def __init__(self, message: str, detail: dict = None):
        super().__init__(status_code=500, message=message, detail=detail)

class RoomEntryNotAuthorizedException(CollaborationServiceException):
    def __init__(self, message: str, detail: dict = None):
        super().__init__(status_code=401, message=message, detail=detail)

class RoomNotFoundException(CollaborationServiceException):
    def __init__(self, message: str, detail: dict = None):
        super().__init__(status_code=404, message=message, detail=detail)

# ======================== DB ============================
class DatabaseException(CollaborationServiceException):
    def __init__(self, message: str, detail: dict = None):
        super().__init__(status_code=500, message=message, detail=detail)

class DatabaseItemNotFoundException(CollaborationServiceException):
    def __init__(self, message: str, detail: dict = None):
        super().__init__(status_code=404, message=message, detail=detail)

# ======================== CRUD ==========================
class CrudException(CollaborationServiceException):
    def __init__(self, message: str, detail: dict = None):
        super().__init__(status_code=500, message=message, detail=detail)

class CrudItemNotFoundException(CollaborationServiceException):
    def __init__(self, message: str, detail: dict = None):
        super().__init__(status_code=404, message=message, detail=detail)

# ============Authentication/authorization ===============
class AuthenticationException(CollaborationServiceException):
    def __init__(self, message: str, detail: dict = None):
        super().__init__(status_code=403, message=message, detail=detail)
