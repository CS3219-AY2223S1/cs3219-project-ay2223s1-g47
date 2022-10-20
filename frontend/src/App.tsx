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
import { DailyProvider } from "@daily-co/daily-react-hooks";

import "react-toastify/dist/ReactToastify.css";
import { NavBar } from "./components/NavBar";
import { HistoryPage } from "./components/HistoryPage";

const AppComponent = styled.div`
  background: rgb(48, 48, 51);
  color: #fff;
  font-family: sans-serif;
  min-height: 100vh;

  a {
    color: rgb(64, 159, 255);
  }
`;

const Content = styled.div`
  margin: 0 auto;
  max-width: 1000px;
  padding: 3rem 0;
`;

function App() {
  // =============== State management ===============
  // user context on login state
  const { isLoggedIn } = useContext(UserContext) as UserContextType;

  console.log("App.tsx: loggedIn = " + isLoggedIn);

  return (
    <AppComponent>
      <Router>
        {isLoggedIn && <NavBar />}
        <Content>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute
                  redirectPath={"/login"}
                  isAllowed={isLoggedIn}
                  children={<Home />}
                />
              }
            />
            <Route
              path="/match"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={isLoggedIn}
                  children={<MatchingPage />}
                />
              }
            />
            <Route
              path="/room"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={isLoggedIn}
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
                  isAllowed={!isLoggedIn} // if logged in, redirect to home
                  children={<LoginPage />}
                />
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={isLoggedIn} // if not logged in, redirect to home
                  children={<AccountPage />}
                />
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={isLoggedIn} // if not logged in, redirect to home
                  children={<HistoryPage />}
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
