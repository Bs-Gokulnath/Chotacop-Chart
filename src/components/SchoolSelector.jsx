import React, { useEffect, useState } from "react";

const chapters = ["Vellore", "Bhopal", "Salem"]; // Consistent with Signin.jsx

const SchoolSelector = ({
  selectedChapter,
  setSelectedChapter,
  selectedSchool,
  setSelectedSchool,
}) => {
  const [chapterChecked, setChapterChecked] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    try {
      if (userData) {
        const parsed = JSON.parse(userData);
        if (parsed?.chapter && chapters.includes(parsed.chapter)) {
          setSelectedChapter(parsed.chapter);
        } else if (!chapterChecked) {
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
  }, [setSelectedChapter, chapterChecked]);

  return (
    <div className="flex items-end gap-4 mt-[10px] mb-8">
      {/* Chapter Field (Read-only) */}
      <div>
        <label className="block text-sm font-medium">Chapter</label>
        <input
          className="mt-1 p-2 border rounded-lg w-[570px] bg-gray-100 text-gray-700"
          value={selectedChapter || ""}
          readOnly
          disabled
        />
      </div>

      {/* School Name Field */}
      <div>
        <label className="block text-sm font-medium">School</label>
        <input
          className="mt-1 p-2 border rounded-lg w-[570px]"
          placeholder="Enter school name"
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
        />
      </div>

      {/* Get Analysis Button */}
      <button
        className={`px-4 py-2 rounded-lg ${
          selectedSchool
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!selectedSchool}
        onClick={() => alert("Analysis triggered!")} // Placeholder action
      >
        Get Analysis
      </button>
    </div>
  );
};

export default SchoolSelector;