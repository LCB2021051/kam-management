import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-lg font-bold">KAM Management</h1>
        <div className="flex space-x-4">
          <Link to="/" className="text-white">
            Dashboard
          </Link>
          <Link to="/leads" className="text-white">
            Leads
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
