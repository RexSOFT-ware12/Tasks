import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";

function App() {
  const user = localStorage.getItem("token");

  return (
    <Routes>
      {user && <Route path="/" exact element={<Main />} />}
      <Route path="/signup" exact element={<Signup />} />
      {!user && <Route path="/login" exact element={<Login />} />}
      {user && <Route path="/login" exact element={<Navigate to="/" />} />}
      {!user && <Route path="/" element={<Navigate to="/login" replace />} />}
    </Routes>
  );
}

export default App;
