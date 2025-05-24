import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const user = localStorage.getItem('user');
  const isLoggedIn = !!user;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      // Store the intended path before redirecting
      localStorage.setItem('intendedRoute', location.pathname);
      alert('Please sign in to access this page.');
      // Redirect to signin page
      navigate('/signin');
    }
  }, [isLoggedIn, location.pathname, navigate]);

  // Render the protected element only if logged in
  return isLoggedIn ? element : null;
};

export default ProtectedRoute; 