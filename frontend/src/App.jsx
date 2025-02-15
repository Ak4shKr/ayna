import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Discussion from "./pages/chat";
import ProtectedRoutes from "./components/routes/protectedRoutes";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <Discussion />
            </ProtectedRoutes>
          }
        />
        <Route path="/login" element={<Login />} />{" "}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
