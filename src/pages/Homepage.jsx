import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Header from "../components/Header"; // Assuming Header is in src/components

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-orange-50">
      <Header isHomepage={true} />
      <div className="flex flex-grow items-center justify-center p-4 mt-[-130px]">
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-10">
          {/* Wrap the first logo in a Link to navigate to /questions */}
          <Link to="/questions">
            <img
              src="/assets/Yi-ChotaCop.png"
              alt="Chota Cop Logo"
              className="w-40 h-auto hover:opacity-80 transition-opacity cursor-pointer"
            />
          </Link>
          {/* <img
            src="/assets/Yi-QuizSample.png"
            alt="Quiz Logo"
            className="w-40 h-auto"
          /> */}
          <img
            src="/assets/Yi-CZ%20Sample.png"
            alt="Colouring Zone Logo"
            className="w-40 h-auto cursor-pointer"
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/assets/Yi Coloring Book-2024.pdf';
              link.download = 'Yi_Coloring_Book_2024.pdf';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Homepage;