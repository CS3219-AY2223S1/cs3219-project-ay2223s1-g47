import styled from "styled-components";

const ButtonComponent = styled.button`
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

const DestructiveButton = styled(ButtonComponent)`
  background: rgb(247, 57, 101);
  box-shadow: 5px 5px 15px 5px rgba(201, 0, 54, .5);

  &:hover {
    background: rgb(255, 77, 118);
    box-shadow: 5px 5px 15px 5px rgba(255, 0, 59, .5);
  }
`;

export function Button({ type, children, onClick }: { type?: string, children: string, onClick?: (e: any) => (void | Promise<void>) }) {
    if (type && type == "destructive") {
        return <DestructiveButton onClick={onClick}>{ children }</DestructiveButton>
    }
    return <ButtonComponent onClick={onClick}>{ children }</ButtonComponent>
}