// import React, { useState } from "react";
// import Header from "../components/Header";
// import ResponseBoxes from "../components/ResponseBoxes";
// import QuestionMatrix from "../components/QuestionMatrix";

// // SchoolSelector Component (Updated)
// const SchoolSelector = ({
//   selectedChapter,
//   setSelectedChapter,
//   selectedSchool,
//   setSelectedSchool,
// }) => {
//   return (
//     <div className="flex items-end gap-4 mt-[10px] mb-8">
//       {/* Chapter Selection */}
//       <div>
//         <label className="block text-sm font-medium">Chapter</label>
//         <select
//           className="mt-1 p-2 border rounded-lg w-[570px]" // Wide width
//           value={selectedChapter}
//           onChange={(e) => setSelectedChapter(e.target.value)}
//         >
//           <option value="VELLORE">Vellore</option>
//           <option value="CHENNAI">Chennai</option>
//           <option value="BANGALORE">Bangalore</option>
//           {/* Add more chapters as needed */}
//         </select>
//       </div>
//       {/* School Selection */}
//       <div>
//         <label className="block text-sm font-medium">School</label>
//         <select
//           className="mt-1 p-2 border rounded-lg w-[570px]" // Wide width
//           value={selectedSchool}
//           onChange={(e) => setSelectedSchool(e.target.value)}
//         >
//           <option value="">Select a school</option>
//           <option value="SCHOOL_A">School A</option>
//           <option value="SCHOOL_B">School B</option>
//           <option value="SCHOOL_C">School C</option>
//           {/* Add more schools as needed */}
//         </select>
//       </div>
//       {/* Get Analysis Button */}
//       <button
//         className={`px-4 py-2 rounded-lg ${
//           selectedSchool
//             ? "bg-blue-500 text-white hover:bg-blue-600"
//             : "bg-gray-300 text-gray-500 cursor-not-allowed"
//         }`}
//         disabled={!selectedSchool}
//         onClick={() => alert("Analysis triggered!")} // Placeholder action
//       >
//         Get Analysis
//       </button>
//     </div>
//   );
// };

// // Analyze Component (Updated)
// const Analyze = () => {
//   const [selectedChapter, setSelectedChapter] = useState("VELLORE");
//   const [selectedSchool, setSelectedSchool] = useState("");

//   return (
//     <div className="min-h-screen bg-[#fdf5eb] flex flex-col">
//       <div className="w-full z-10">
//         <Header />
//       </div>
//       <div className="flex flex-grow items-center justify-center px-4 py-10 mt-[-80px]">
//         <div className="bg-[#fdf5eb] shadow-xl p-8 rounded-xl w-full max-w-[95%] space-y-6">
//           {/* School/Chapter selection */}
//           <SchoolSelector
//             selectedChapter={selectedChapter}
//             setSelectedChapter={setSelectedChapter}
//             selectedSchool={selectedSchool}
//             setSelectedSchool={setSelectedSchool}
//           />
//           {/* Responses and Matrix */}
//           <div className="flex items-end gap-4 mb-2">
//             <div className="flex flex-col w-[220px]">
//               <div className="rounded-lg w-full font-medium">
//                 Total Responses
//               </div>
//             </div>
//             <div className="flex-1">
//               <ResponseBoxes count={8} />
//             </div>
//           </div>
//           {/* Matrix */}
//           <QuestionMatrix />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Analyze;



import React, { useState } from "react";
import Header from "../components/Header";
import ResponseBoxes from "../components/ResponseBoxes";
import QuestionMatrix from "../components/QuestionMatrix";
import SchoolSelector from "../components/SchoolSelector";

const Analyze = () => {
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  return (
    <div className="min-h-screen bg-[#fdf5eb] flex flex-col">
      <div className="w-full z-10">
        <Header />
      </div>
      <div className="flex flex-grow items-center justify-center px-4 py-10 mt-[-80px]">
        <div className="bg-[#fdf5eb] shadow-xl p-8 rounded-xl w-full max-w-[95%] space-y-6">
          {/* School/Chapter selection */}
          <SchoolSelector
            selectedChapter={selectedChapter}
            setSelectedChapter={setSelectedChapter}
            selectedSchool={selectedSchool}
            setSelectedSchool={setSelectedSchool}
          />
          {/* Responses and Matrix */}
          <div className="flex items-end gap-4 mb-2">
            <div className="flex flex-col w-[220px]">
              <div className="rounded-lg w-full font-medium">
                Total Responses
              </div>
            </div>
            <div className="flex-1">
              <ResponseBoxes count={8} />
            </div>
          </div>
          {/* Matrix */}
          <QuestionMatrix />
        </div>
      </div>
    </div>
  );
};

export default Analyze;