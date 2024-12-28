import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate("/search", { state: { name: searchTerm } });
      setSearchTerm(""); // Clear search bar after search
      setIsMenuOpen(false); // Close the menu
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center gap-5">
        {/* Left: KAM Management */}
        <Link
          to="/"
          className="text-white text-lg font-bold hover:underline hidden md:block"
        >
          KAM Management
        </Link>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center w-full max-w-md mx-auto"
        >
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-l border-none focus:outline-none text-black"
          />
          <button
            type="submit"
            className="bg-white text-blue-500 px-4 py-2 rounded-r hover:bg-gray-100"
          >
            Search
          </button>
        </form>

        <Link
          to={"/leads/performance"}
          className="text-white hover:underline hidden md:block"
        >
          Performance
        </Link>

        {/* Right: Leads and Logout */}
        <div className="flex gap-4 items-center">
          <Link
            to="/leads"
            className="text-white hover:underline hidden md:block"
          >
            Leads
          </Link>
          {user && (
            <button
              onClick={handleLogout}
              className="text-white hover:underline hidden md:block"
            >
              Logout
            </button>
          )}
        </div>

        {/* Hamburger Menu for Small Screens */}
        <button
          className="text-white md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMenuOpen
                  ? "M6 18L18 6M6 6l12 12" // Cross icon when open
                  : "M4 6h16M4 12h16M4 18h16" // Hamburger icon when closed
              }
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mt-4 bg-blue-500 text-white p-4 space-y-4 md:hidden">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block hover:underline"
          >
            KAM Management
          </Link>
          <Link
            to="/leads"
            onClick={() => setIsMenuOpen(false)}
            className="block hover:underline"
          >
            Leads
          </Link>
          {user && (
            <button
              onClick={() => {
                setIsMenuOpen(false);
                handleLogout();
              }}
              className="block hover:underline"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
