import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ProblemList from "./components/problems/ProblemList";
import ProblemPage from "./pages/ProblemPage";
import Navbar from "./components/common/Navbar";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/problems" replace />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problem/:problemId" element={<ProblemPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
