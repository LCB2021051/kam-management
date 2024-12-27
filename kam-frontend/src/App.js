import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.js";
import Dashboard from "./pages/Dashboard.js";
import Leads from "./pages/Leads.js";
import SearchPage from "./pages/SearchPage.js";
import LeadPage from "./pages/LeadPage.js";
import LeadForm from "./components/LeadForm.js";
import EditLeadForm from "./components/EditLeadForm.js";
import Performance from "./pages/Performance.js";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/leads/:id" element={<LeadPage />} />
        <Route path="/leads/edit/:id" element={<EditLeadForm />} />
        <Route path="/leads/addNew" element={<LeadForm />} />
        <Route path="/leads/Performance" element={<Performance />} />
      </Routes>
    </Router>
  );
};

export default App;
