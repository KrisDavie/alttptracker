import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LaunchPage from "./components/LaunchPage";
import { Tracker } from "./components/Tracker";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LaunchPage />} />
        <Route path="/tracker" element={<Tracker />} />
      </Routes>
    </Router>
  );
}

export default App;
