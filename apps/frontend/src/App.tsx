import { Route, Routes } from "react-router";
import "./App.css";
import { ChartPage } from "./pages/ChartPage";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChartPage />} />
      </Routes>
    </>
  );
}

export default App;
