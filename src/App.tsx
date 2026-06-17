import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ThemeProvider } from "./components/ThemeProvider";

const LaunchPage = lazy(() => import("./components/LaunchPage"));
const Tracker = lazy(() => import("./components/Tracker").then(m => ({ default: m.Tracker })));
const TrackerMap = lazy(() => import("./components/TrackerMap").then(m => ({ default: m.TrackerMap })));
const TrackerEventLog = lazy(() => import("./components/TrackerEventLog").then(m => ({ default: m.TrackerEventLog })));

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Suspense>
          <Routes>
            <Route path="/" element={<LaunchPage />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/map" element={<TrackerMap />} />
            <Route path="/event-log" element={<TrackerEventLog />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
