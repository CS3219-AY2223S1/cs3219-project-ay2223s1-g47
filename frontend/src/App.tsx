import ProtectedRoute from "./components/utils/routing/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./components/user/SignupPage";
import { Box } from "@mui/material";
import LoginPage from "./components/user/LoginPage";
import Home from "./components/Home";
import AccountPage from "./components/AccountPage";
import { useContext } from "react";
import { UserContext, UserContextType } from "./contexts/UserContext";
import MatchingPage from "./components/matching/MatchingPage";
import { ToastContainer } from "react-toastify";
import CollaborationPage from "./components/collaboration/CollaborationPage";
import styled from "styled-components";

import 'react-toastify/dist/ReactToastify.css';
import { NavBar } from "./components/NavBar";

const AppComponent = styled.div`
  background: #444;
  color: #fff;
  font-family: sans-serif;
  min-height: 100vh;
`;

const Content = styled.div`
  margin: 0 auto;
  max-width: 1000px;
  padding: 3rem 0;
`;

function App() {
  // =============== State management ===============
  // user context on login state
  const { user } = useContext(UserContext) as UserContextType;
  const { loggedIn } = user;

  console.log("App.tsx: loggedIn = " + loggedIn);

  return (
    <AppComponent>
      <Router>
        <NavBar/>
        <Content>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute
                  redirectPath={"/login"}
                  isAllowed={loggedIn}
                  children={<Home />}
                />
              }
            />
            <Route
              path="/match"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={loggedIn}
                  children={<MatchingPage />}
                />
              }
            />
            <Route
              path="/room"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={loggedIn}
                  children={<CollaborationPage />}
                />
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={true} // if logged in, redirect to home
                  children={<SignupPage />}
                />
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={!loggedIn} // if logged in, redirect to home
                  children={<LoginPage />}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={loggedIn} // if logged in, redirect to home
                  children={<AccountPage />}
                />
              }
            />
          </Routes>
        </Content>
      </Router>
    </AppComponent>
  );
}

export default App;
