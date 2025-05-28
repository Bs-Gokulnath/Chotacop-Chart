import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Header({ hideAuthLinks, showHomeLink, isHomepage, showHomeOnQuestions }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
  const currentPath = location.pathname;

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
        {/* Home */}
      </Link>
    );
  } else if (!hideAuthLinks) {
    if (isLoggedIn) {
      sessionLinks.push(
          <button
          key="logout"
            onClick={handleLogout}
            className="text-red-600 font-semibold hover:underline"
          >
            Logout
          </button>
      );

      if (currentPath === '/admin') {
        sessionLinks.unshift(
          <Link key="home-on-admin" to="/" className="text-blue-600 font-semibold hover:underline">
            {/* Home */}
          </Link>
        );
      } else if (isHomepage) {
        sessionLinks.unshift(
          <Link key="dashboard-on-home" to="/admin" className="text-blue-600 font-semibold hover:underline">
            Dashboard
          </Link>
        );
      } else if (showHomeLink) {
        sessionLinks.unshift(
          <Link key="home-general" to="/" className="text-blue-600 font-semibold hover:underline">
            {/* Home */}
          </Link>
        );
      }
    } else {
      if (!isHomepage) {
        sessionLinks.push(
          <Link key="home" to="/" className="text-blue-600 font-semibold hover:underline">
            {/* Home */}
          </Link>
        );
      }
      // Add Admin Dashboard link when not logged in and not on signin/signup pages
      if (currentPath !== '/signin' && currentPath !== '/signup') {
          sessionLinks.push(
              <Link key="admin-dashboard-unauth" to="/admin" className="text-blue-600 font-semibold hover:underline">
                  {/* Admin */}
              </Link>
          );
      }
      sessionLinks.push(
        <Link key="signin" to="/signin" className="text-purple-700 font-medium hover:underline">
              Sign In
        </Link>,
        <Link key="signup" to="/signup" className="text-purple-700 font-medium hover:underline">
              {/* Sign Up */}
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