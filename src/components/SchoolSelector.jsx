import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionMatrix from "./QuestionMatrix";
import ResponseBoxes from "./ResponseBoxes";

const SPECIAL_USER_ID = "a0580799-f9f4-4731-87c4-b0906a68f7e2";
const API_ENDPOINT = "http://148.135.137.228:5001/chapter-observation";

const SchoolSelector = ({ selectedChapter, setSelectedChapter, selectedSchool, setSelectedSchool }) => {
  const [schools, setSchools] = useState([]);
  const [userId, setUserId] = useState("");
  // selectedChapter and selectedSchool are now passed as props from the parent
  const [analysisData, setAnalysisData] = useState(null);
  const [isSpecialUser, setIsSpecialUser] = useState(false);
  const [allChaptersData, setAllChaptersData] = useState([]); // To store the array of chapter data for the special user
  const [chapterFetchedForStandardUser, setChapterFetchedForStandardUser] = useState(false); // Track if chapter is fetched for standard user

  // Effect to get user ID and determine user type
  useEffect(() => {
    const userData = localStorage.getItem("user");
    try {
      if (userData) {
        const parsed = JSON.parse(userData);
        const user_id = parsed?.userId;

        if (user_id) {
          setUserId(user_id);
          setIsSpecialUser(user_id === SPECIAL_USER_ID);
          // Reset states when user changes
          setSelectedChapter("");
          setSelectedSchool("");
          setAnalysisData(null);
          setAllChaptersData([]);
          setSchools([]);
          setChapterFetchedForStandardUser(false); // Reset fetch status
        } else {
          console.warn("User data found in local storage but no userId.");
          alert("User ID not found. Please sign in again.");
          // Optionally clear local storage or prompt re-signin
        }
      } else {
        alert("Please sign in first.");
        // Optionally redirect to sign-in page
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
      alert("Error reading user data. Please sign in again.");
      // Optionally clear local storage or prompt re-signin
    }
     // This effect should run once on mount and possibly if local storage changes (though not explicitly watching local storage here)
  }, []); // Empty dependency array means this effect runs once on mount

  // Effect to fetch initial data (chapters and schools) based on user ID and type
  useEffect(() => {
    if (!userId) {
      // If user is not loaded, clear relevant states and stop
      setSchools([]);
      setSelectedChapter("");
      setSelectedSchool("");
      setAnalysisData(null);
      setAllChaptersData([]);
      setChapterFetchedForStandardUser(false);
      return;
    }

     // Prevent re-fetching for standard user if chapter is already set
    if (!isSpecialUser && selectedChapter && chapterFetchedForStandardUser) {
        return;
    }


    axios
      .post(API_ENDPOINT, {
        user_id: userId,
      })
      .then((response) => {
        const responseData = response.data; // Use the full response data to check structure

        if (isSpecialUser) {
          // For special user, responseData.data is an array of chapter objects
          const chaptersData = responseData?.data;
          if (Array.isArray(chaptersData)) {
            setAllChaptersData(chaptersData); // Store the array of chapter data

            // Populate chapter dropdown and set the first chapter as selected
            const chapters = chaptersData.map((item) => item.chapter);
            if (chapters.length > 0) {
              setSelectedChapter(chapters[0]);
            } else {
               setSelectedChapter("");
            }
          } else {
            console.error("API response for special user is not in expected array format:", responseData);
            alert("Error fetching chapter data for special user.");
            setAllChaptersData([]);
            setSelectedChapter("");
          }

        } else {
          // For standard user, responseData has 'chapter' and 'data' fields at top level
           if (responseData && typeof responseData === 'object' && responseData.chapter && responseData.data && typeof responseData.data === 'object') {
             const chapterName = responseData.chapter;
             const schoolData = responseData.data;

             setSelectedChapter(chapterName); // Set the user's chapter
             setChapterFetchedForStandardUser(true); // Mark chapter as fetched

             // Populate schools from the data object keys
             const schoolNames = Object.keys(schoolData);
             setSchools(schoolNames);
             // Optionally select the first school if available
             if (schoolNames.length > 0) {
                setSelectedSchool(schoolNames[0]);
             } else {
                 setSelectedSchool("");
             }

           } else {
             console.error("API response for standard user is not in expected format:", responseData);
             alert("Error fetching chapter and school data for your user.");
             setSelectedChapter("");
             setSchools([]);
           }
        }
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
        alert("Failed to fetch chapter and school data.");
        setSchools([]);
        setSelectedChapter("");
        setSelectedSchool("");
        setAllChaptersData([]);
      });
  }, [userId, isSpecialUser]); // Depend on userId and isSpecialUser

  // Effect to update schools when selected chapter changes (only for special user)
  useEffect(() => {
      if (isSpecialUser && selectedChapter && allChaptersData.length > 0) {
          const chapterData = allChaptersData.find(item => item.chapter === selectedChapter);
          if (chapterData?.data) {
              const schoolsForChapter = Object.keys(chapterData.data);
              setSchools(schoolsForChapter);
               // Clear selected school if the previously selected school is not in the new list
              if (selectedSchool && !schoolsForChapter.includes(selectedSchool)) {
                  setSelectedSchool('');
              } else if (!selectedSchool && schoolsForChapter.length > 0) {
                   // Optionally auto-select the first school
                   setSelectedSchool(schoolsForChapter[0]);
              }
          } else {
              setSchools([]);
              setSelectedSchool('');
          }
      } else if (!isSpecialUser && selectedChapter && schools.length === 0) {
          // This case might occur if schools were not correctly populated for a standard user initially
          // Re-fetch schools for the selected chapter if needed, or rely on the initial fetch
          // For the given standard user API response, schools are available with chapter, so initial fetch should be enough.
           // Let's add a check here in case the initial fetch missed schools for some reason
           // (Though based on the provided JSON, it shouldn't)
           // console.log("Standard user: selected chapter changed, but schools were not loaded. Investigate API response structure.");
           // The initial fetch logic should handle this, so commenting this out to avoid potential infinite loops
      } else if (!selectedChapter) {
         // selectedChapter is empty, clear schools
         setSchools([]);
         setSelectedSchool('');
      }
       setAnalysisData(null); // Clear analysis data whenever chapter or school data changes
  }, [selectedChapter, isSpecialUser, allChaptersData, selectedSchool]); // Depend on selectedChapter, isSpecialUser, allChaptersData, and selectedSchool

  const handleGetAnalysis = () => {
    if (!selectedSchool || !selectedChapter || !userId) {
        alert("Please select a chapter and school.");
        return;
    }

     // Call the API to get analysis data for the selected school
    axios
      .post(API_ENDPOINT, {
        user_id: userId,
        school_name: selectedSchool,
         // Include chapter in the request payload if the API requires it for analysis
         chapter: selectedChapter, // API might need chapter as well
      })
      .then((response) => {
         const responseData = response.data?.data; // This structure might vary

          if (isSpecialUser) {
              // For special user, find the selected chapter and then the school data within it
              const chapterData = allChaptersData.find(item => item.chapter === selectedChapter);
              if (chapterData?.data?.[selectedSchool]) {
                  // The actual analysis data for the matrix is inside the school object
                  setAnalysisData(chapterData.data[selectedSchool]);
              } else {
                  alert("No analysis data found for the selected school in the special user's data.");
                  setAnalysisData(null);
              }
          } else {
              // For standard user, assume responseData[selectedSchool] holds the analysis data directly
               // Based on the standard user API response, responseData here should be the schools object
               if (responseData && responseData[selectedSchool]) {
                setAnalysisData(responseData[selectedSchool]);
              } else {
                console.warn("Unexpected API response structure for standard user analysis or no data:", responseData);
                alert("No analysis data found for the selected school.");
                 setAnalysisData(null);
              }
          }

      })
      .catch((error) => {
        console.error("Error fetching analysis data:", error);
        alert("Failed to fetch analysis data.");
        setAnalysisData(null);
      });
  };


  return (
    <div className="flex flex-col gap-6 mt-6 mb-10">
      {/* Chapter + School + Button Inline */}
      <div className="flex gap-4 items-end flex-wrap">
        {/* Chapter Field/Dropdown */}
        <div className="w-[590px]">
          <label className="block text-sm font-medium mb-1">Chapter</label>
           {isSpecialUser ? (
            // Render dropdown for special user
            <select
              className="p-2 border rounded-lg w-full"
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                // Schools and analysis data will be reset by the effects triggered by selectedChapter change
              }}
              disabled={!userId} // Disable if user is not loaded yet
            >
              <option value="">Select a chapter</option>
              {allChaptersData.map((item, index) => (
                <option key={item.chapter || index} value={item.chapter}>
                  {item.chapter}
                </option>
              ))}
            </select>
           ) : (
            // Render disabled input for other users
             <input
                className="p-2 border rounded-lg w-full bg-gray-100 text-gray-700"
                value={selectedChapter || "Loading chapter..."}
                readOnly
                disabled
             />
           )}
        </div>

        {/* School Dropdown */}
        <div className="w-[590px]">
          <label className="block text-sm font-medium mb-1">School</label>
           <select
            className="p-2 border rounded-lg w-full"
            value={selectedSchool}
            onChange={(e) => {
               setSelectedSchool(e.target.value);
               setAnalysisData(null); // Clear analysis data when school changes
            }}
             // Disable if no chapter is selected or no schools are available for the selected chapter
            disabled={!selectedChapter || schools.length === 0}
          >
            <option value="">Select a school</option>
            {schools.map((school, index) => (
              <option key={school || index} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>

        {/* Get Analysis Button */}
        <div className="h-[38px] flex items-center">
          <button
            className={`px-5 py-2 rounded-lg transition ${
              selectedSchool && selectedChapter && userId
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!selectedSchool || !selectedChapter || !userId} // Ensure user, chapter, and school are selected
            onClick={handleGetAnalysis}
          >
            Get Analysis
          </button>
        </div>
      </div>

      {/* Render QuestionMatrix if analysisData is available */}
      {analysisData && <QuestionMatrix analysisData={analysisData} />}

      {/* ResponseBoxes section - keeping its original placement */}
       <div className="flex items-end gap-4 mb-2">
            <div className="flex flex-col w-[220px]">
              <div className="rounded-lg w-full font-medium">
                
              </div>
            </div>
             <div className="flex-1">
              {/* You might need to pass actual response count data here if available in analysisData */}
              <ResponseBoxes count={8} /> {/* Placeholder count */}
            </div>
          </div>
    </div>
  );
};

export default SchoolSelector;
