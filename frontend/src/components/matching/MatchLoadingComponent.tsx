import styled from "styled-components";
import { Button } from "../Button";

const MatchLoading = styled.div`
    display: grid;
    font-weight: bold;
    grid-row-gap: 2rem;
    justify-content: center;
`;

const Match = styled.div`
    position: relative;
    margin: 0 auto;
`;

const MatchFlame = styled.div`
    background: rgb(255, 179, 117);
    border-radius: 50%;
    box-shadow: 0 -5px 20px 5px rgba(255, 90, 8, .8), 0 -2px 10px 5px rgba(255, 179, 117);
    height: 50px;
    left: -21px;
    position: absolute;
    top: -15px;
    width: 50px;
    animation-name: flame-animation;
    animation-duration: 3s;
    animation-iteration-count: infinite;

    @keyframes flame-animation {
        0% {
            height: 50px;
            left: -21px;
            width: 50px;
        }
        50% {
            height: 40px;
            left: -16px;
            width: 40px;
        }
        100% {
            height: 50px;
            left: -21px;
            width: 50px;
        }
    }
`;

const MatchTip = styled.div`
    background: rgb(48, 48, 51);
    border-radius: 20px 20px 4px 4px;
    height: 25px;
    left: -4px;
    position: relative;
    width: 15px;
`;

const MatchStick = styled.div`
    background: rgb(207, 183, 163);
    height: 100px;
    position: relative;
    width: 8px;
`;

export function MatchLoadingComponent({ onDisconnect }: { onDisconnect: (e: any) => void }) {
    return <MatchLoading>
        <Match>
            <MatchFlame/>
            <MatchTip/>
            <MatchStick/>
        </Match>
        <p>Please wait while we search for a match...</p>
        <Button type="destructive" onClick={onDisconnect}>Cancel Match</Button>
    </MatchLoading>
}