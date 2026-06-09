import { Route, Routes } from "react-router";
import "./App.css";
import { TradePage } from "./pages/TradePage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<TradePage />} />
      </Routes>
    </>
  );
}

export default App;
