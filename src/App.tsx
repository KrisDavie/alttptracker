import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LaunchPage from "./components/LaunchPage";
import { Tracker } from "./components/Tracker";
import LogicBreaksPage from "./components/LogicBreaksPage";
import { ThemeProvider } from "./components/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LaunchPage />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/logic" element={<LogicBreaksPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
