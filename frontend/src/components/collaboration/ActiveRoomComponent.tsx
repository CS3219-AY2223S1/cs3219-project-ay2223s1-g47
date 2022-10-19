import styled from "styled-components";
import { Button } from "../Button";

const RoomCard = styled.div`
  border-radius: 20px;
  box-shadow: 5px 5px 15px 5px rgba(0, 0, 0, .4),
      -5px -5px 15px 5px rgba(63, 63, 74, 1);
  display: grid;
  grid-column-gap: .5rem;
  grid-template-columns: 1fr auto auto;
  padding: .8em 2em;
`;

export function ActiveRoomComponent(props: { onJoin: () => void, onDisconnect: () => void }) {
    const { onJoin, onDisconnect } = props;

    return <RoomCard>
      <p>You have an active session</p>
      <Button onClick={onJoin}>Join</Button>
      <Button onClick={onDisconnect} type="destructive">Disconnect</Button>
    </RoomCard>
}