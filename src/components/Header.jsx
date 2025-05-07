import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/signin"); // or wherever your sign-in route is
  };

  return (
    <div className="bg-[#fdf5eb] py-4">

      {/* Session Links */}
      <div className="flex justify-end px-6 mb-3">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:underline"
          >
            Logout
          </button>
        ) : (
          <div className="space-x-4">
            <Link
              to="/signin"
              className="text-purple-700 font-medium hover:underline"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-purple-700 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>

      {/* Top Logos (visible only on md and larger) */}
      <div className="hidden md:flex justify-between items-center px-6">
        {/* Yi Logo */}
        <a
          href="https://youngindians.net/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="http://yi.crivo.in/img/Yi.png"
            alt="Yi Logo"
            className="h-20 object-contain"
          />
        </a>

        {/* CII Logo */}
        <a
          href="https://www.cii.in/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="http://yi.crivo.in/img/Yi-CII.png"
            alt="CII Logo"
            className="h-16 object-contain"
          />
        </a>
      </div>

      {/* Center Road Safety Logo - Desktop */}
      <div className="hidden md:flex justify-center -mt-20">
        <a
          href="https://youngindians.net/road-safety/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="http://yi.crivo.in/img/Yi-RoadSafety.png"
            alt="Road Safety Logo"
            className="h-24 object-contain"
          />
        </a>
      </div>

      {/* Center Road Safety Logo - Mobile */}
      <div className="md:hidden flex justify-center mt-4">
        <a
          href="https://youngindians.net/road-safety/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="http://yi.crivo.in/img/Yi-RoadSafety.png"
            alt="Road Safety Logo"
            className="h-20 object-contain"
          />
        </a>
      </div>

      
    </div>
  );
}

export default Header;
