import ProtectedRoute from "./components/utils/routing/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./components/user/SignupPage";
import { Box } from "@mui/material";
import LoginPage from "./components/user/LoginPage";
import Home from "./components/Home";
import { useContext } from "react";
import { UserContext, UserContextType } from "./contexts/UserContext";
import MatchingPage from "./components/matching/MatchingPage";

function App() {
  // =============== State management ===============
  // user context on login state
  const { user } = useContext(UserContext) as UserContextType;
  const { loggedIn } = user;

  console.log("App.tsx: loggedIn = " + loggedIn);

  return (
    <div className="App">
      <Box display={"flex"} flexDirection={"column"} padding={"1rem"}>
        <Router>
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
              path="/signup"
              element={
                <ProtectedRoute
                  redirectPath={"/"}
                  isAllowed={!loggedIn} // if logged in, redirect to home
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
          </Routes>
        </Router>
      </Box>
    </div>
  );
}

export default App;
