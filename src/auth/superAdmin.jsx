import React, { useState } from "react";
import Header from "../components/Header";
import { FiMoreVertical } from "react-icons/fi";

const chapterList = [
  "Agra", "Ahmedabad", "Ajmer", "Amaravati", "Balasore", "Bengaluru", "Bhopal", "Bhavnagar", "Bhubaneswar",
  "Chandigarh", "Chennai", "Chhatrapati Sambhajinagar", "Coimbatore", "Dehradun", "Delhi", "Dindigul", "Durg",
  "Erode", "Goa", "Gurugram", "Guwahati", "Gwalior", "Hosur", "Hubballi", "Hyderabad", "Indore", "Jaipur",
  "Jabalpur", "Jamshedpur", "Kanpur", "Karur", "Kochi", "Kolkata", "Kota", "Kozhikode", "Lucknow", "Madurai",
  "Mangaluru", "Mumbai", "Mysuru", "Nagaland", "Nagpur", "Nashik", "Noida", "Puducherry", "Pune", "Raipur",
  "Rajkot", "Ranchi", "Salem", "Sikkim", "Siliguri", "Sivakasi", "Surat", "Thoothukudi", "Tirupur", "Tirupati",
  "Trichy", "Trivandrum", "Vadodara", "Varanasi", "Vellore", "Vizag"
];

// Dummy email data mapped to chapters
const chapterEmailMap = chapterList.reduce((acc, chapter, index) => {
  acc[chapter] = [
    `${chapter.toLowerCase()}1@example.com`,
    `${chapter.toLowerCase()}2@example.com`,
    `${chapter.toLowerCase()}3@example.com`
  ];
  return acc;
}, {});

const SuperAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [menuOpenIndex, setMenuOpenIndex] = useState(null);

  const filteredChapters = chapterList.filter((chapter) =>
    chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleMenu = (index) => {
    setMenuOpenIndex(menuOpenIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#fdf5eb] flex flex-col">
      <Header />
      <div className="flex flex-grow items-center justify-center px-4 py-10">
        <div className="bg-[#fdf5eb] shadow-xl p-8 rounded-xl w-full max-w-6xl">
          <div className="flex gap-8 justify-center">
            {/* Chapters Column */}
            <div className="flex flex-col items-start w-1/2">
              <span className="text-2xl font-semibold mb-4">Chapters</span>
              <input
                type="text"
                placeholder="Search Chapters..."
                className="mb-4 w-full border px-3 py-2 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="bg-[#fdf5eb] border p-4 rounded-lg w-full space-y-3 max-h-96 overflow-y-auto">
                {filteredChapters.map((chapter, index) => (
                  <div
                    key={index}
                    className={`bg-white border rounded-md h-10 px-3 flex items-center cursor-pointer hover:bg-gray-100 transition ${
                      selectedChapter === chapter ? "bg-blue-100" : ""
                    }`}
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    {chapter}
                  </div>
                ))}
              </div>
            </div>

            {/* Email Column */}
            <div className="flex flex-col items-start w-1/2">
              <span className="text-2xl font-semibold mb-4">Email</span>
              <div className="bg-[#fdf5eb] border p-4 rounded-lg w-full space-y-3 max-h-96 overflow-y-auto">
                {selectedChapter ? (
                  chapterEmailMap[selectedChapter]?.map((email, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-white border rounded-md h-10 px-4"
                    >
                      <span className="text-sm">{email}</span>
                      <div className="relative">
                        <FiMoreVertical
                          className="cursor-pointer"
                          onClick={() => toggleMenu(i)}
                        />
                        {menuOpenIndex === i && (
                          <div className="absolute right-0 mt-2 bg-white border shadow-md rounded-md z-10 w-40">
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Change Email
                            </div>
                            <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                              Change Chapter
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">Select a chapter to see emails</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdmin;
