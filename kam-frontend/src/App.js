import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Dashboard from "./pages/Dashboard.js";
import Leads from "./pages/Leads.js";
import SearchPage from "./pages/SearchPage.js";
import LeadPage from "./pages/LeadPage.js";
import LeadForm from "./components/LeadForm.js";
import EditLeadForm from "./components/EditLeadForm.js";
import Performance from "./pages/Performance.js";
import Login from "./pages/Login.js";
import PrivateRoute from "./components/PrivateRoute.js";
import Unauthorized from "./pages/Unauthorized.js";

const App = () => {
  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("authToken")
  );
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <Router>
      {authToken && user ? (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute allowedRoles={["admin"]} user={user}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* Additional Private Routes */}
            <Route
              path="/leads"
              element={
                <PrivateRoute user={user}>
                  <Leads />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute user={user}>
                  <SearchPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/leads/:id"
              element={
                <PrivateRoute user={user}>
                  <LeadPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/leads/edit/:id"
              element={
                <PrivateRoute user={user}>
                  <EditLeadForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/leads/addNew"
              element={
                <PrivateRoute user={user}>
                  <LeadForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/leads/performance"
              element={
                <PrivateRoute user={user}>
                  <Performance />
                </PrivateRoute>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<Login setAuthToken={setAuthToken} setUser={setUser} />}
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
};

export default App;
