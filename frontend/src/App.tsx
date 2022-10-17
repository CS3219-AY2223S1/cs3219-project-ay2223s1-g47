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

import "react-toastify/dist/ReactToastify.css";

function App() {
  // =============== State management ===============
  // user context on login state
  const { isLoggedIn } = useContext(UserContext) as UserContextType;

  console.log("App.tsx: loggedIn = " + isLoggedIn);

  return (
    <div className="App" style={{ minHeight: "100vh" }}>
      <Router>
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
        </Routes>
      </Router>
    </div>
  );
}

export default App;
