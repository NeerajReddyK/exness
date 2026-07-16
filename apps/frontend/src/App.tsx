import { Route, Routes } from "react-router";
import "./App.css";
import { TradePage } from "./pages/TradePage";
import { SignUp } from "./pages/SignUp";
import { LogIn } from "./pages/LogIn";

function App() {
  return (
    <>
      <Routes>
        <Route path="/home" element={<TradePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Routes>
    </>
  );
}

export default App;
