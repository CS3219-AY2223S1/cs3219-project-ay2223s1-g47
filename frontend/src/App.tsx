import ProtectedRoute from "./components/utils/routing/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./components/user/SignupPage";
import { Box } from "@mui/material";
import LoginPage from "./components/user/LoginPage";
import Home from "./components/Home";
import { useContext } from "react";
import { UserContext, UserContextType } from "./contexts/UserContext";

function App() {
  // =============== State management ===============
  // user context on login state
  const { user } = useContext(UserContext) as UserContextType;
  const { loggedIn } = user;

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
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </Box>
    </div>
  );
}

export default App;
