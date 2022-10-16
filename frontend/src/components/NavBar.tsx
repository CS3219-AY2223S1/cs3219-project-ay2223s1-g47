import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { UserContext, UserContextType } from "../contexts/UserContext";

const NavBarWrapper = styled.div`
    // background: rgba(0, 0, 0, .2);
    color: #bbb;

    ul {
        align-items: center;
        display: flex;
        list-style-type: none;
        margin: 0;
        padding: 0;
    }

    li {
        margin: 0 0 0 1em;

        a {
            color: inherit;
            text-decoration: none;
        }
    }

    li:first-of-type {
        flex: 1;
        margin: 0;
    }

    a:hover {
        opacity: .8;
    }
`;

const LogoutButton = styled.button`
    background: none;
    border: none;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    margin: 0;
    padding: 0;

    &:hover {
        cursor: pointer;
        opacity: .8;
    }
`;

const NavBarComponent = styled.nav`
    margin: 0 auto;
    max-width: 1000px;
    padding: 1rem 0;
`;

const Logo = styled.span`
    font-size: 2rem;
    font-weight: bold;

    > span:first-of-type {
        color: rgb(255, 179, 117);
        text-shadow: 5px 2px 20px rgba(255, 90, 8, .8);
    }
    > span:last-of-type {
        color: rgb(46, 137, 255);
        text-shadow: 5px 2px 20px rgba(34, 0, 224, .5);
    }
`;


export function NavBar() {
    const { logout } = useContext(UserContext) as UserContextType;
    
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout().then((response) => {
          if (response.status === 201) {
            navigate("/login");
          } else {
            const errorMessage: string =
              "Something went wrong! Please try again later.";
            toast(errorMessage);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    
    return <NavBarWrapper>
        <NavBarComponent>
            <ul>
                <li><Link to="/">
                    <Logo><span>Peer</span><span>Prep</span></Logo>
                </Link></li>
                <li><Link to="/history">History</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li>
                    <LogoutButton onClick={ handleLogout }>
                        Logout
                    </LogoutButton>
                </li>
            </ul>
        </NavBarComponent>
    </NavBarWrapper>
}