import ProtectedRoute from "./components/routing/ProtectedRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./components/users/SignupPage";
import { Box } from "@mui/material";

function App() {
  return (
    <div className="App">
      <Box display={"flex"} flexDirection={"column"} padding={"4rem"}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute redirectPath={"/signup"} isAllowed={false} />
              }
            />
            <Route
              path="/signup"
              element={
                <ProtectedRoute
                  redirectPath={"/login"}
                  isAllowed={true}
                  children={<SignupPage />}
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
