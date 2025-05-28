import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Header from "../components/Header"; // Assuming Header is in src/components

const AdminHomepage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      <Header isHomepage={true} />
      <div className="flex flex-grow items-center justify-center p-4 mt-[-130px]">
        <div className="flex flex-wrap justify-center items-center gap-18">
          {/* Wrap the first logo in a Link to navigate to /questions */}
          <Link to="/analyze">
            <img
              src="/assets/analyze.png"
              alt="Chota Cop Logo"
              className="w-40 h-auto hover:opacity-80 transition-opacity cursor-pointer"
            />
            <p className="text-center text-xl font-bold">Analyze</p>
          </Link>
          {/* <Link to="/bulk">
            <img
              src="/assets/submit.png"
              alt="Chota Cop Logo"
              className="w-40 h-auto hover:opacity-80 transition-opacity cursor-pointer"
            />
            <p className="text-center text-xl font-bold ">Bulk Submission </p>
          </Link> */}
        </div>
      </div>
    </div>
  );
};

export default AdminHomepage;