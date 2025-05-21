import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionMatrix from "./QuestionMatrix";
import ResponseBoxes from "./ResponseBoxes";

const SPECIAL_USER_ID = "a0580799-f9f4-4731-87c4-b0906a68f7e2";
const API_ENDPOINT = "http://148.135.137.228:5001/chapter-observation";

const SchoolSelector = ({ selectedChapter, setSelectedChapter, selectedSchool, setSelectedSchool }) => {
  const [schools, setSchools] = useState([]);
  const [userId, setUserId] = useState("");
  const [analysisData, setAnalysisData] = useState(null);
  const [isSpecialUser, setIsSpecialUser] = useState(false);
  const [allChaptersData, setAllChaptersData] = useState([]);
  const [chapterFetchedForStandardUser, setChapterFetchedForStandardUser] = useState(false);

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
          setChapterFetchedForStandardUser(false);
        } else {
          console.warn("User data found in local storage but no userId.");
          alert("User ID not found. Please sign in again.");
        }
      } else {
        alert("Please sign in first.");
      }
    } catch (error) {
      console.error("Failed to parse user data:", error);
        alert("Error reading user data. Please sign in again.");
    }
  }, []);

  // Effect to fetch initial data (chapters and schools) based on user ID and type
  useEffect(() => {
    if (!userId) {
      setSchools([]);
      setSelectedChapter("");
      setSelectedSchool("");
      setAnalysisData(null);
      setAllChaptersData([]);
      setChapterFetchedForStandardUser(false);
      return;
    }

    if (!isSpecialUser && selectedChapter && chapterFetchedForStandardUser) {
        return;
    }

    axios
      .post(API_ENDPOINT, {
        user_id: userId,
      })
      .then((response) => {
        const responseData = response.data;

        if (isSpecialUser) {
          const chaptersData = responseData?.data;
          if (Array.isArray(chaptersData)) {
            setAllChaptersData(chaptersData);
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
           if (responseData && typeof responseData === 'object' && responseData.chapter && responseData.data && typeof responseData.data === 'object') {
             const chapterName = responseData.chapter;
             const schoolData = responseData.data;

             setSelectedChapter(chapterName);
             setChapterFetchedForStandardUser(true);

             const schoolNames = Object.keys(schoolData);
             setSchools(schoolNames);
              if (schoolNames.length > 0) {
                setSelectedSchool(schoolNames[0]); // Auto-select first school for standard user
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
  }, [userId, isSpecialUser]);

  // Effect to update schools when selected chapter changes (only for special user)
  // and to trigger analysis data fetch when selected school changes
  useEffect(() => {
      // Clear analysis data and schools if chapter is changed or becomes empty
       if (!selectedChapter) {
         setSchools([]);
         setSelectedSchool('');
         setAnalysisData(null);
         return;
      }

      if (isSpecialUser) {
          if (allChaptersData.length > 0) {
              const chapterData = allChaptersData.find(item => item.chapter === selectedChapter);
              if (chapterData?.data) {
                  const schoolsForChapter = Object.keys(chapterData.data);
                  // Add 'All Schools' option at the beginning
                  setSchools(['All Schools', ...schoolsForChapter]);
                  // If 'All Schools' was previously selected, keep it selected, otherwise clear or select first real school
                  if (selectedSchool === 'All Schools') {
                      // Keep 'All Schools' selected
                  } else if (selectedSchool && !schoolsForChapter.includes(selectedSchool)) {
                      setSelectedSchool('');
                  } else if (!selectedSchool && schoolsForChapter.length > 0) {
                       // Optionally auto-select the first school or 'All Schools'
                       setSelectedSchool('All Schools'); // Auto-select 'All Schools' by default
                  }
              } else {
                  setSchools([]);
                  setSelectedSchool('');
              }
          }
      } else {
          // For standard users, schools were already set in the initial fetch effect
          // based on their assigned chapter. Add 'All Schools' to their limited list
          const schoolsForChapter = Object.keys(schools);
           if (schoolsForChapter.length > 0) {
               setSchools(['All Schools', ...schoolsForChapter]);
               // Auto-select 'All Schools' for standard users if they have schools
               setSelectedSchool('All Schools');
           } else {
                setSchools([]);
                setSelectedSchool('');
           }
      }

       // *** Trigger analysis data fetch when selectedSchool changes and is not empty ***
       if (selectedSchool && selectedChapter && userId) {
           if (selectedSchool === 'All Schools') {
               // Aggregate data for all schools in the selected chapter
               let aggregatedData = [];
               const chapterData = isSpecialUser
                ? allChaptersData.find(item => item.chapter === selectedChapter)
                : { data: schools.reduce((acc, school) => { // Assuming schools state for standard user holds the single school's data structure
                     if (school !== 'All Schools' && analysisData && analysisData.length > 0) { // Use existing analysisData for the single school as source
                          acc[school] = analysisData; // This might need adjustment based on how standard user data is structured
                     } else if (school !== 'All Schools') {
                         // Fallback if analysisData isn't structured as expected, might need re-fetching
                         console.warn("Analysis data not available for aggregation in standard user mode.");
                         // Consider refetching the chapter data here to get the school's data
                     }
                     return acc;
                   }, {}) };

               if (chapterData?.data) {
                   const schoolsToAggregate = Object.keys(chapterData.data).filter(school => school !== 'All Schools');
                   if (schoolsToAggregate.length > 0) {
                       const firstSchoolData = chapterData.data[schoolsToAggregate[0]];
                       if (Array.isArray(firstSchoolData)) {
                            // Initialize aggregated data structure based on questions from the first school
                           aggregatedData = firstSchoolData.map(q => ({ q: q.q, yes: 0, no: 0 }));

                           // Sum up yes/no for each question across all schools
                           schoolsToAggregate.forEach(schoolName => {
                               const schoolAnalysis = chapterData.data[schoolName];
                                if (Array.isArray(schoolAnalysis)) {
                                    schoolAnalysis.forEach((question, qIdx) => {
                                        if (aggregatedData[qIdx]) {
                                            aggregatedData[qIdx].yes += question.yes || 0;
                                            aggregatedData[qIdx].no += question.no || 0;
                                        }
                                    });
                                }
                           });
                            setAnalysisData(aggregatedData);
                       } else {
                            console.error("Unexpected data structure for school analysis data during aggregation.");
                            setAnalysisData(null);
                       }
                   } else {
                        // No schools to aggregate
                        setAnalysisData(null);
                   }
               } else {
                   // No chapter data found for aggregation
                   setAnalysisData(null);
               }

           } else {
               // Fetch data for a specific school (existing logic)
                axios
                  .post(API_ENDPOINT, {
                    user_id: userId,
                    school_name: selectedSchool,
                     chapter: selectedChapter,
                  })
                  .then((response) => {
                     const responseData = response.data?.data; // This structure might vary

                      if (isSpecialUser) {
                          const chapterData = allChaptersData.find(item => item.chapter === selectedChapter);
                          if (chapterData?.data?.[selectedSchool]) {
                              setAnalysisData(chapterData.data[selectedSchool]);
                          } else {
                              // alert("No analysis data found for the selected school in the special user's data.");
                              setAnalysisData(null);
                          }
                      } else {
                           // For standard users, the initial fetch already provided the school data
                           // We just need to extract it based on selectedSchool name
                            if (responseData && responseData[selectedSchool]) {
                             setAnalysisData(responseData[selectedSchool]);
                           } else {
                             console.warn("Unexpected API response structure for standard user analysis or no data for single school:", responseData);
                            // Fallback: attempt to use the data fetched initially if available
                            const initialData = schools.length > 1 ? schools.find(s => Object.keys(s)[0] === selectedSchool) : null; // Assuming schools state might hold initial data structure
                            if(initialData && initialData[selectedSchool]) {
                                setAnalysisData(initialData[selectedSchool]);
                            } else {
                                alert("No analysis data found for the selected school.");
                                setAnalysisData(null);
                            }

                           }
                      }
                  })
                  .catch((error) => {
                    console.error("Error fetching analysis data for single school:", error);
                    alert("Failed to fetch analysis data.");
                    setAnalysisData(null);
                  });
           }
       } else {
           // Clear analysis data if school or chapter is not selected, or user is not loaded
           setAnalysisData(null);
       }

  }, [selectedChapter, isSpecialUser, allChaptersData, selectedSchool, userId, schools]); // Added 'schools' to dependencies

  return (
    <div className="flex flex-col gap-6 mt-6 mb-10">
      {/* Chapter + School */}
      <div className="flex gap-4 items-end flex-wrap">
        {/* Chapter Field/Dropdown */}
        <div className="w-[650px]">
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
              disabled={!userId}
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
        <div className="w-[650px]">
          <label className="block text-sm font-medium mb-1">School</label>
          <select
            className="p-2 border rounded-lg w-full"
            value={selectedSchool}
            onChange={(e) => {
               setSelectedSchool(e.target.value);
               // Analysis data fetching is now triggered by selectedSchool change useEffect
            }}
            disabled={!selectedChapter || schools.length === 0}
          >
            <option value="">Select a school</option>
            {/* Render 'All Schools' option first */}
            {schools.includes('All Schools') && <option value="All Schools">All Schools</option>}
            {/* Render actual schools, excluding 'All Schools' if it was manually added */}
            {schools
              .filter(school => school !== 'All Schools')
              .map((school, index) => (
              <option key={school || index} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render QuestionMatrix always, pass analysisData */}
      {/* analysisData will be null initially, or populated after school selection */}
       <QuestionMatrix analysisData={analysisData || []} />

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
