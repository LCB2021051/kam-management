import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.js";
import Profile from "./pages/Profile.js";

const App = () => {
  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/client/:id" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
