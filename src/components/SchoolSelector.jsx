import React, { useEffect } from "react";

const chapters = ["VELLORE", "BHOPAL", "SALEM"];

const SchoolSelector = ({
  selectedChapter,
  setSelectedChapter,
  selectedSchool,
  setSelectedSchool
}) => {
  // Get chapter from localStorage if available
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const { chapter } = JSON.parse(userData);
      if (chapter) {
        setSelectedChapter(chapter);
      }
    }
  }, [setSelectedChapter]);

  return (
  <div className="flex gap-4">
    <div className="flex-1">
      <label className="block text-gray-700 mb-1 mt-[20px] font-semibold">Chapter</label>
      {/* Check if chapter is from localStorage */}
      {localStorage.getItem("user") ? (
        <input
          className="w-full border p-2 rounded-lg bg-gray-100"
          value={selectedChapter}
          readOnly
        />
      ) : (
        <select
          className="w-full border p-2 rounded-lg"
          value={selectedChapter}
          onChange={e => setSelectedChapter(e.target.value)}
        >
          {chapters.map(ch => (
            <option key={ch} value={ch}>{ch}</option>
          ))}
        </select>
      )}
    </div>
    <div className="flex-1">
      <label className="block text-gray-700 mb-1 mt-[20px] font-semibold">School name</label>
      <input
        className="w-full border p-2 rounded-lg"
        placeholder="School name"
        value={selectedSchool}
        onChange={e => setSelectedSchool(e.target.value)}
      />
    </div>
  </div>
  );
};

export default SchoolSelector;
