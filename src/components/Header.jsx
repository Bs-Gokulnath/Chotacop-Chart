import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Header({ hideAuthLinks, showHomeLink, isHomepage, alwaysShowHome, showHomeOnQuestions }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/signin");
  };

  let sessionLinks = [];

  if (hideAuthLinks && showHomeOnQuestions) {
    sessionLinks.push(
      <Link key="home" to="/" className="text-blue-600 font-semibold hover:underline">
        Home
      </Link>
    );
  } else if (!hideAuthLinks) {
    if (isLoggedIn) {
      if (showHomeLink && !isHomepage) {
        sessionLinks.push(
          <Link key="home" to="/" className="text-blue-600 font-semibold hover:underline">
            Home
          </Link>
        );
      }
      if (isHomepage) {
        sessionLinks.push(
          <Link key="dashboard" to="/analyze" className="text-blue-600 font-semibold hover:underline">
            Dashboard
          </Link>
        );
      }
      sessionLinks.push(
        <button
          key="logout"
          onClick={handleLogout}
          className="text-red-600 font-semibold hover:underline"
        >
          Logout
        </button>
      );
    } else {
      if (!isHomepage) {
        sessionLinks.push(
          <Link key="home" to="/" className="text-blue-600 font-semibold hover:underline">
            Home
          </Link>
        );
      }
      sessionLinks.push(
        <Link key="signin" to="/signin" className="text-purple-700 font-medium hover:underline">
          Sign In
        </Link>,
        <Link key="signup" to="/signup" className="text-purple-700 font-medium hover:underline">
          Sign Up
        </Link>
      );
    }
    if (alwaysShowHome && !sessionLinks.some((link) => link.key === "home")) {
      sessionLinks.unshift(
        <Link key="home-always" to="/" className="text-blue-600 font-semibold hover:underline">
          Home
        </Link>
      );
    }
  }

  return (
    <div className="bg-[#fdf5eb] py-4">
      {/* Session Links */}
      <div className="flex justify-end px-6 mb-3">
        <div className="space-x-4">{sessionLinks}</div>
      </div>

      {/* Top Logos (visible only on md and larger) */}
      <div className="hidden md:flex justify-between items-center px-6">
        {/* Yi Logo */}
        <a
          href="https://youngindians.net/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
          onClick={() => console.log("Yi Logo clicked")}
        >
          <img
            src="/assets/Yi.png" // Reference directly from public/assets
            alt="Yi Logo"
            className="h-20 object-contain"
          />
        </a>

        {/* CII Logo */}
        <a
          href="https://www.cii.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="cursor-pointer"
        >
          <img
            src="/assets/Yi-CII.png" // Reference directly from public/assets
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
          className="cursor-pointer"
        >
          <img
            src="/assets/Yi-RoadSafety.png" // Reference directly from public/assets
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
          className="cursor-pointer"
        >
          <img
            src="/assets/Yi-RoadSafety.png" // Reference directly from public/assets
            alt="Road Safety Logo"
            className="h-20 object-contain"
          />
        </a>
      </div>
    </div>
  );
}

export default Header;