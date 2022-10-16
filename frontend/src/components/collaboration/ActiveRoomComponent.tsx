import styled from "styled-components";

const RoomCard = styled.div`
  border-radius: 20px;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, .4),
      -5px -5px 15px 5px rgba(63, 63, 74, 1);
  display: grid;
  grid-column-gap: .5rem;
  grid-template-columns: 1fr auto auto;
  padding: .8em 2em;
`;

const Button = styled.button`
  background: rgb(46, 137, 255);
  border: none;
  border-radius: 2rem;
  box-shadow: 5px 5px 15px 5px rgba(34, 0, 224, .5);
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: bold;
  min-width: 0;
  padding: .8em 1.6em;

  &:hover {
    background: rgb(64, 159, 255);
    box-shadow: 5px 5px 15px 5px rgba(43, 54, 255, .5);
    cursor: pointer;
  }
`;

const DestructiveButton = styled.button`
  background: rgb(247, 57, 101);
  border: none;
  border-radius: 2rem;
  box-shadow: 5px 5px 15px 5px rgba(201, 0, 54, .5);
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: bold;
  min-width: 0;
  padding: .8em 1.6em;

  &:hover {
    background: rgb(255, 77, 118);
    box-shadow: 5px 5px 15px 5px rgba(255, 0, 59, .5);
    cursor: pointer;
  }
`;

export function ActiveRoomComponent() {
    return <RoomCard>
      <p>You have an active session</p>
      <Button>Join</Button>
      <DestructiveButton>Disconnect</DestructiveButton>
    </RoomCard>
}