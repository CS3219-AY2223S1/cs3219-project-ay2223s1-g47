# 1. match 
# 2. call collaboration to create room -> roomId
# 3. return roomId to frontend

# 4. frontend goes to collaboration with roomid to start session

{
    "room_id": "1234",
}

"""

src/
    matching/
        TpendingMatch.ts
        queue-services.ts // interfacing with rbmq
        matching-socket-manager.ts
    constants.ts
tests/
    matching/
        test_matching-socket-manager.ts
README.md // set up, development + testing + ci
package.json
...
    
"""