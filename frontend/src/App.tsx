import ProtectedRoute from "./components/utils/routing/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./components/users/SignupPage";
import { Box } from "@mui/material";
import LoginPage from "./components/users/LoginPage";

function App() {
  // =============== State management ===============
  // user context on login state

  return (
    <div className="App">
      <Box display={"flex"} flexDirection={"column"} padding={"1rem"}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute redirectPath={"/login"} isAllowed={false} />
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
