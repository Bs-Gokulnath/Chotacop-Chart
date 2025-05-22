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
  const [standardUserData, setStandardUserData] = useState(null);
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
          setStandardUserData(null);
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
      setStandardUserData(null);
      setChapterFetchedForStandardUser(false);
      return;
    }

    if (!isSpecialUser && selectedChapter && chapterFetchedForStandardUser) {
        // For standard user, initial data is already fetched and processed
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
             // Store the full response data for standard user
             setStandardUserData(responseData);

             const chapterName = responseData.chapter;
             const schoolData = responseData.data;

             setSelectedChapter(chapterName);
             setChapterFetchedForStandardUser(true);

             const schoolNames = Object.keys(schoolData);
              // Schools state should be an array of school names
             setSchools(schoolNames);

              if (schoolNames.length > 0) {
                //setSelectedSchool(schoolNames[0]); // Auto-select first school for standard user initially
                setSelectedSchool('All Schools'); // Auto-select 'All Schools' by default
             } else {
                 setSelectedSchool("");
             }
           } else {
             console.error("API response for standard user is not in expected format:", responseData);
             alert("Error fetching chapter and school data for your user.");
             setSelectedChapter("");
             setSchools([]);
             setStandardUserData(null);
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
        setStandardUserData(null);
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
                  // Add 'All Schools' option at the beginning if not already present
                  if (!schools.includes('All Schools')) {
                     setSchools(['All Schools', ...schoolsForChapter]);
                  } else {
                     // Update schools list ensuring 'All Schools' is still first
                     const currentSchoolsWithoutAll = schools.filter(s => s !== 'All Schools');
                     const newSchools = ['All Schools', ...schoolsForChapter];
                     // Only update if the list of schools has actually changed (excluding 'All Schools')
                     if (JSON.stringify(currentSchoolsWithoutAll) !== JSON.stringify(schoolsForChapter)) {
                         setSchools(newSchools);
                     }
                  }

                  // If 'All Schools' was previously selected, keep it selected, otherwise clear or select first real school
                  if (selectedSchool === 'All Schools') {
                      // Keep 'All Schools' selected
                  } else if (selectedSchool && !schoolsForChapter.includes(selectedSchool)) {
                      setSelectedSchool(''); // Clear selection if previously selected school is not in the new list
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
          // based on their assigned chapter. We need to ensure 'All Schools' is added.
          // Ensure schools is treated as an array of strings
          const currentSchools = Array.isArray(schools) ? schools : [];
           // Check if 'All Schools' is already the first element or if there are schools to add
           if (currentSchools[0] !== 'All Schools' && (currentSchools.length > 0 || (standardUserData?.data && Object.keys(standardUserData.data).length > 0))) {
               setSchools(['All Schools', ...currentSchools]);
               // Auto-select 'All Schools' for standard users if they have schools
               setSelectedSchool('All Schools'); // Auto-select 'All Schools' by default
           } else if (currentSchools.length === 0 && standardUserData?.data && Object.keys(standardUserData.data).length > 0) {
               // If schools were empty initially but standardUserData has school data, populate schools and add 'All Schools'
               const schoolNames = Object.keys(standardUserData.data);
                setSchools(['All Schools', ...schoolNames]); // Ensure schools state contains both 'All Schools' and the actual school names
                 setSelectedSchool('All Schools'); // Auto-select 'All Schools'
            } else if (currentSchools.length === 0) {
                 // No schools found initially and no school data in standardUserData
                 setSchools([]);
                 setSelectedSchool('');
            }
       }

       // *** Trigger analysis data fetch when selectedSchool changes and is not empty ***
       if (selectedSchool && selectedChapter && userId) {
           if (selectedSchool === 'All Schools') {
               // Aggregate data for all schools in the selected chapter
               let aggregatedData = [];

               if (isSpecialUser) {
                    const chapterData = allChaptersData.find(item => item.chapter === selectedChapter);
                    if (chapterData?.data) {
                       const schoolsToAggregate = Object.keys(chapterData.data);
                        if (schoolsToAggregate.length > 0) {
                            // Assuming the structure is consistent across schools, take questions from the first school
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
                                 console.error("Unexpected data structure for school analysis data during aggregation for special user.");
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
                   // Standard user aggregation
                   if (standardUserData?.data && standardUserData.chapter === selectedChapter) {
                       const schoolData = standardUserData.data;
                        const schoolsToAggregate = Object.keys(schoolData);
                        if (schoolsToAggregate.length > 0) {
                           // Assuming the structure is consistent across schools for the standard user's single chapter
                           // The initial fetch for standard users gives data for their chapter and their schools within it.
                           // If 'All Schools' is selected by a standard user, it means aggregate over the schools they have access to in their chapter.
                           // Standard user data structure: { chapter: "ChapterName", data: { "School1": [analysis data], "School2": [analysis data] } }
                           const firstSchoolName = schoolsToAggregate[0];
                           const firstSchoolData = schoolData[firstSchoolName];

                           if (Array.isArray(firstSchoolData)) {
                                aggregatedData = firstSchoolData.map(q => ({ q: q.q, yes: 0, no: 0 }));

                                schoolsToAggregate.forEach(schoolName => {
                                    const schoolAnalysis = schoolData[schoolName];
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
                                console.error("Unexpected data structure for school analysis data during aggregation for standard user.");
                                setAnalysisData(null);
                           }

                        } else {
                             // No schools to aggregate for standard user
                             setAnalysisData(null);
                        }
                   } else {
                       // Standard user data not available or chapter mismatch
                       console.warn("Standard user data not available or chapter mismatch for aggregation.", { standardUserData, selectedChapter });
                       setAnalysisData(null);
                   }
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
                     const responseData = response.data?.data; // This structure might vary based on the backend

                      if (isSpecialUser) {
                          const chapterData = allChaptersData.find(item => item.chapter === selectedChapter);
                          if (chapterData?.data?.[selectedSchool]) {
                              setAnalysisData(chapterData.data[selectedSchool]);
                          } else {
                              // alert("No analysis data found for the selected school in the special user's data.");
                              setAnalysisData(null);
                          }
                      } else {
                           // For standard users, the initial fetch already provided the school data for their chapter.
                           // We need to extract the data for the selected specific school from the stored standardUserData.
                            if (standardUserData?.data?.[selectedSchool]) {
                                setAnalysisData(standardUserData.data[selectedSchool]);
                            } else {
                                console.warn("Analysis data not found for the selected school in standard user data.", { selectedSchool, standardUserData });
                                alert("No analysis data found for the selected school.");
                                setAnalysisData(null);
                           }
                      }
                  })
                  .catch((error) => {
                    console.error("Error fetching analysis data for specific school:", error);
                    alert("Failed to fetch analysis data for the selected school.");
                    setAnalysisData(null);
                  });
           }
       } else {
            // Clear analysis data if school or chapter is not selected, or userId is missing
           setAnalysisData(null);
       }

  }, [selectedChapter, selectedSchool, userId, isSpecialUser, allChaptersData, standardUserData]); // Added standardUserData to dependencies

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
