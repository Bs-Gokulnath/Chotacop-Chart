// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import QuestionMatrix from "./QuestionMatrix";

// const chapters = ["Vellore", "Bhopal", "Salem"];

// const SchoolSelector = () => {
//   const [chapterChecked, setChapterChecked] = useState(false);
//   const [schools, setSchools] = useState([]);
//   const [userId, setUserId] = useState("");
//   const [selectedChapter, setSelectedChapter] = useState("");
//   const [selectedSchool, setSelectedSchool] = useState("");
//   const [analysisData, setAnalysisData] = useState(null);

//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     try {
//       if (userData) {
//         const parsed = JSON.parse(userData);
//         const chapter = parsed?.chapter;
//         const user_id = parsed?.userId;

//         if (chapter && chapters.includes(chapter)) {
//           setSelectedChapter(chapter);
//         }

//         if (user_id) {
//           setUserId(user_id);
//         }

//         if ((!chapter || !chapters.includes(chapter)) && !chapterChecked) {
//           alert("Chapter not found. Please sign in first.");
//           setChapterChecked(true);
//         }
//       } else if (!chapterChecked) {
//         alert("Please sign in first.");
//         setChapterChecked(true);
//       }
//     } catch (error) {
//       console.error("Failed to parse user data:", error);
//       if (!chapterChecked) {
//         alert("Error reading user data. Please sign in again.");
//         setChapterChecked(true);
//       }
//     }
//   }, [chapterChecked]);

//   useEffect(() => {
//     if (userId) {
//       axios
//         .post("http://148.135.137.228:5001/chapter-observation", {
//           user_id: userId,
//         })
//         .then((response) => {
//           const data = response.data?.data;
//           if (data) {
//             const schoolNames = Object.keys(data);
//             setSchools(schoolNames);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching school data:", error);
//           alert("Failed to fetch school data.");
//         });
//     }
//   }, [userId]);

//   const handleGetAnalysis = () => {
//     if (!selectedSchool) return;

//     axios
//       .post("http://148.135.137.228:5001/chapter-observation", {
//         user_id: userId,
//       })
//       .then((response) => {
//         const data = response.data?.data;
//         if (data && data[selectedSchool]) {
//           setAnalysisData(data[selectedSchool]);
//         } else {
//           alert("No analysis data found for the selected school.");
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching analysis data:", error);
//         alert("Failed to fetch analysis data.");
//       });
//   };

//   return (
//     <div className="flex flex-col gap-6 mt-6 mb-10">
//       {/* Chapter + School + Button Inline */}
//       <div className="flex gap-4 items-end flex-wrap">
//         {/* Chapter Field */}
//         <div className="w-[590px]">
//           <label className="block text-sm font-medium mb-1">Chapter</label>
//           <input
//             className="p-2 border rounded-lg w-full bg-gray-100 text-gray-700"
//             value={selectedChapter || ""}
//             readOnly
//             disabled
//           />
//         </div>

//         {/* School Dropdown */}
//         <div className="w-[590px]">
//           <label className="block text-sm font-medium mb-1">School</label>
//           <select
//             className="p-2 border rounded-lg w-full"
//             value={selectedSchool}
//             onChange={(e) => setSelectedSchool(e.target.value)}
//           >
//             <option value="">Select a school</option>
//             {schools.map((school, index) => (
//               <option key={index} value={school}>
//                 {school}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Get Analysis Button */}
//         <div className="h-[38px] flex items-center">
//           <button
//             className={`px-5 py-2 rounded-lg transition ${
//               selectedSchool
//                 ? "bg-blue-500 text-white hover:bg-blue-600"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//             disabled={!selectedSchool}
//             onClick={handleGetAnalysis}
//           >
//             Get Analysis
//           </button>
//         </div>
//       </div>

//       {/* Render QuestionMatrix if analysisData is available */}
//       {analysisData && <QuestionMatrix analysisData={analysisData} />}
//     </div>
//   );
// };

// export default SchoolSelector;


import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionMatrix from "./QuestionMatrix";
import ResponseBoxes from "./ResponseBoxes";

const chapters = ["Vellore", "Bhopal", "Salem"];

const SchoolSelector = () => {
  const [chapterChecked, setChapterChecked] = useState(false);
  const [schools, setSchools] = useState([]);
  const [userId, setUserId] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    try {
      if (userData) {
        const parsed = JSON.parse(userData);
        const chapter = parsed?.chapter;
        const user_id = parsed?.userId;

        if (chapter && chapters.includes(chapter)) {
          setSelectedChapter(chapter);
        }

        if (user_id) {
          setUserId(user_id);
        }

        if ((!chapter || !chapters.includes(chapter)) && !chapterChecked) {
          alert("Chapter not found. Please sign in first.");
          setChapterChecked(true);
        }
      } else if (!chapterChecked) {
        alert("Please sign in first.");
        setChapterChecked(true);
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      if (!chapterChecked) {
        alert("Error reading user data. Please sign in again.");
        setChapterChecked(true);
      }
    }
  }, [chapterChecked]);

  useEffect(() => {
    if (userId) {
      axios
        .post("http://148.135.137.228:5001/chapter-observation", {
          user_id: userId,
        })
        .then((response) => {
          const data = response.data?.data;
          if (data) {
            const schoolNames = Object.keys(data);
            setSchools(schoolNames);
          }
        })
        .catch((error) => {
          console.error("Error fetching school data:", error);
          alert("Failed to fetch school data.");
        });
    }
  }, [userId]);

  const handleGetAnalysis = () => {
    if (!selectedSchool) return;

    axios
      .post("http://148.135.137.228:5001/chapter-observation", {
        user_id: userId,
      })
      .then((response) => {
        const data = response.data?.data;
        if (data && data[selectedSchool]) {
          setAnalysisData(data[selectedSchool]);
        } else {
          alert("No analysis data found for the selected school.");
        }
      })
      .catch((error) => {
        console.error("Error fetching analysis data:", error);
        alert("Failed to fetch analysis data.");
      });
  };

  return (
    <div className="flex flex-col gap-6 mt-6 mb-10">
      {/* Chapter + School + Button Inline */}
      <div className="flex gap-4 items-end flex-wrap">
        {/* Chapter Field */}
        <div className="w-[590px]">
          <label className="block text-sm font-medium mb-1">Chapter</label>
          <input
            className="p-2 border rounded-lg w-full bg-gray-100 text-gray-700"
            value={selectedChapter || ""}
            readOnly
            disabled
          />
        </div>

        {/* School Dropdown */}
        <div className="w-[590px]">
          <label className="block text-sm font-medium mb-1">School</label>
          <select
            className="p-2 border rounded-lg w-full"
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
          >
            <option value="">Select a school</option>
            {schools.map((school, index) => (
              <option key={index} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        {/* Get Analysis Button */}
        <div className="h-[38px] flex items-center">
          <button
            className={`px-5 py-2 rounded-lg transition ${
              selectedSchool
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedSchool}
            onClick={handleGetAnalysis}
          >
            Get Analysis
          </button>
        </div>
      </div>


      {/* Render QuestionMatrix if data is available */}
      {analysisData && <QuestionMatrix analysisData={analysisData} />}
    </div>
  );
};

export default SchoolSelector;
