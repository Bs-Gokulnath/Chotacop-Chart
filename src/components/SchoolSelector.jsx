import React, { useEffect, useState } from "react";
import axios from "axios";
import QuestionMatrix from "./QuestionMatrix";
import ResponseBoxes from "./ResponseBoxes";

// Updated API endpoint
const API_ENDPOINT = "https://chotacop.in/api/chapter-data";

const SchoolSelector = ({ selectedChapter, setSelectedChapter, selectedSchool, setSelectedSchool }) => {
  const [schools, setSchools] = useState([]);
  const [userId, setUserId] = useState("");
  // State for analysis data based on observation (for Card Data column)
  const [observationAnalysisData, setObservationAnalysisData] = useState(null);
  // State for analysis data based on question_stats (for Ride 1-7 columns)
  const [questionStatsAnalysisData, setQuestionStatsAnalysisData] = useState(null);

  // State to track if the response structure is 'All_Chapter' type
  const [isAllChapterStructure, setIsAllChapterStructure] = useState(false);
  // State to store data for the 'All_Chapter' structure (entire response data)
  const [allChaptersResponseData, setAllChaptersResponseData] = useState(null);
  // State to store data for the standard user structure (entire response data)
  const [standardUserResponseData, setStandardUserResponseData] = useState(null);

  // Effect to get user ID
  useEffect(() => {
    const userData = localStorage.getItem("user");
    try {
      if (userData) {
        const parsed = JSON.parse(userData);
        const user_id = parsed?.userId;

        if (user_id) {
          setUserId(user_id);
          // Reset states when user changes
          setSelectedChapter("");
          setSelectedSchool("");
          setObservationAnalysisData(null);
          setQuestionStatsAnalysisData(null);
          setAllChaptersResponseData(null);
          setSchools([]);
          setStandardUserResponseData(null);
          setIsAllChapterStructure(false);
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

  // Effect to fetch initial data (chapters and schools) based on user ID and determine structure
  useEffect(() => {
    if (!userId) {
      setSchools([]);
      setSelectedChapter("");
      setSelectedSchool("");
      setObservationAnalysisData(null);
      setQuestionStatsAnalysisData(null);
      setAllChaptersResponseData(null);
      setStandardUserResponseData(null);
      setIsAllChapterStructure(false);
      return;
    }

    // Prevent re-fetching if data is already loaded for the current user session
    if (allChaptersResponseData !== null || standardUserResponseData !== null) {
      return;
    }

    axios
      .post(API_ENDPOINT, {
        user_id: userId,
      })
      .then((response) => {
        const responseData = response.data;

        if (
          responseData?.chapter === "ALL_Chapter" &&
          responseData?.chapters &&
          typeof responseData.chapters === "object"
        ) {
          // Handle 'ALL_Chapter' structure
          setIsAllChapterStructure(true);
          setAllChaptersResponseData(responseData);

          const chapters = Object.keys(responseData.chapters);
          if (chapters.length > 0) {
            setSelectedChapter(chapters[0]); // Auto-select the first chapter
          } else {
            setSelectedChapter("");
          }
        } else if (
          responseData &&
          typeof responseData === "object" &&
          responseData.chapter &&
          responseData.observation &&
          typeof responseData.observation === "object"
        ) {
          // Handle standard user structure
          setIsAllChapterStructure(false);
          setStandardUserResponseData(responseData);

          setSelectedChapter(responseData.chapter);

          const schoolNames = Object.keys(responseData.observation);
          setSchools(schoolNames);

          if (schoolNames.length > 0) {
            setSelectedSchool("All Schools");
          } else {
            setSelectedSchool("");
          }
        } else {
          console.error("API response is not in expected format for either structure:", responseData);
          alert("Error fetching initial data.");
          setSelectedChapter("");
          setSchools([]);
          setAllChaptersResponseData(null);
          setStandardUserResponseData(null);
          setIsAllChapterStructure(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching initial data:", error);
        alert("Failed to fetch chapter and school data.");
        setSchools([]);
        setSelectedChapter("");
        setSelectedSchool("");
        setAllChaptersResponseData(null);
        setStandardUserResponseData(null);
        setIsAllChapterStructure(false);
      });
  }, [userId]);

  // Effect to update schools and analysis data when selected chapter or school changes
  useEffect(() => {
    if (!selectedChapter) {
      setSchools([]);
      setSelectedSchool("");
      setObservationAnalysisData(null);
      setQuestionStatsAnalysisData(null);
      return;
    }

    // Update schools based on selectedChapter (for All_Chapter structure)
    if (isAllChapterStructure && allChaptersResponseData?.chapters) {
      const chapterData = allChaptersResponseData.chapters[selectedChapter];
      if (chapterData?.observation) {
        const schoolsForChapter = Object.keys(chapterData.observation);
        const newSchools = ["All Schools", ...schoolsForChapter];

        setSchools(newSchools);
        if (schoolsForChapter.length > 0 && !selectedSchool) {
          setSelectedSchool("All Schools");
        } else if (schoolsForChapter.length === 0) {
          setSelectedSchool("");
        }
      } else {
        setSchools([]);
        setSelectedSchool("");
      }
    } else if (!isAllChapterStructure && standardUserResponseData?.observation) {
      const currentSchools = Array.isArray(schools) ? schools : [];
      if (
        currentSchools[0] !== "All Schools" &&
        (currentSchools.length > 0 ||
          (standardUserResponseData?.observation &&
            Object.keys(standardUserResponseData.observation).length > 0))
      ) {
        setSchools(["All Schools", ...currentSchools]);
        if (!selectedSchool) {
          setSelectedSchool("All Schools");
        }
      } else if (
        currentSchools.length === 0 &&
        standardUserResponseData?.observation &&
        Object.keys(standardUserResponseData.observation).length > 0
      ) {
        const schoolNames = Object.keys(standardUserResponseData.observation);
        setSchools(["All Schools", ...schoolNames]);
        setSelectedSchool("All Schools");
      } else if (currentSchools.length === 0) {
        setSchools([]);
        setSelectedSchool("");
      }
    }

    // Process and set analysis data
    if (selectedChapter && userId) {
      let currentObservationAnalysis = null;
      let currentQuestionStatsAnalysis = null;

      if (isAllChapterStructure && allChaptersResponseData?.chapters) {
        const chapterData = allChaptersResponseData.chapters[selectedChapter];

        // Process Observation data (for Card Data column)
        if (selectedSchool && chapterData?.observation) {
          if (selectedSchool === "All Schools") {
            let aggregatedObservationData = [];
            const schoolsToAggregate = Object.keys(chapterData.observation);
            if (schoolsToAggregate.length > 0) {
              const firstSchoolName = schoolsToAggregate[0];
              const firstSchoolObservation = chapterData.observation[firstSchoolName];
              if (Array.isArray(firstSchoolObservation)) {
                aggregatedObservationData = firstSchoolObservation.map((q) => ({
                  q: q.q,
                  yes: 0,
                  no: 0,
                }));
                schoolsToAggregate.forEach((schoolName) => {
                  const schoolObservation = chapterData.observation[schoolName];
                  if (Array.isArray(schoolObservation)) {
                    schoolObservation.forEach((question, qIdx) => {
                      if (aggregatedObservationData[qIdx]) {
                        aggregatedObservationData[qIdx].yes += question.yes || 0;
                        aggregatedObservationData[qIdx].no += question.no || 0;
                      }
                    });
                  }
                });
                currentObservationAnalysis = aggregatedObservationData;
              }
            }
          } else {
            currentObservationAnalysis = chapterData.observation[selectedSchool] || null;
          }
        }

        // Process question_stats data (for Ride 1-7 columns)
        if (chapterData?.question_stats) {
          let rideStatsData = [];
          const questionKeys = Object.keys(chapterData.question_stats); // e.g., ["q1", "q2", ...]
          questionKeys.forEach((qKey, qIndex) => {
            const questionStats = chapterData.question_stats[qKey];
            if (questionStats?.rides) {
              const ridesData = questionStats.rides;
              let ridesArray = [];
              for (let i = 0; i <= 6; i++) {
                const rideKey = `ride_${i}`;
                const rideData = ridesData[rideKey] || { ones: 0, zeros: 0, total: 0 };
                ridesArray.push({
                  ride: rideKey,
                  yes: rideData.ones || 0,
                  no: rideData.zeros || 0,
                  total: rideData.total || 0,
                });
              }
              rideStatsData.push({
                qIndex,
                rides: ridesArray,
                qName: qKey,
              });
            } else {
              let ridesArray = [];
              for (let i = 0; i <= 6; i++) {
                ridesArray.push({ ride: `ride_${i}`, yes: 0, no: 0, total: 0 });
              }
              rideStatsData.push({ qIndex, rides: ridesArray, qName: qKey });
            }
          });
          currentQuestionStatsAnalysis = rideStatsData;
        }
      } else if (!isAllChapterStructure && standardUserResponseData?.observation) {
        if (selectedSchool && standardUserResponseData.observation) {
          if (selectedSchool === "All Schools") {
            const schoolData = standardUserResponseData.observation;
            const schoolsToAggregate = Object.keys(schoolData);
            if (schoolsToAggregate.length > 0) {
              const firstSchoolName = schoolsToAggregate[0];
              const firstSchoolObservation = schoolData[firstSchoolName];
              if (Array.isArray(firstSchoolObservation)) {
                let aggregatedObservationData = firstSchoolObservation.map((q) => ({
                  q: q.q,
                  yes: 0,
                  no: 0,
                }));
                schoolsToAggregate.forEach((schoolName) => {
                  const schoolObservation = schoolData[schoolName];
                  if (Array.isArray(schoolObservation)) {
                    schoolObservation.forEach((question, qIdx) => {
                      if (aggregatedObservationData[qIdx]) {
                        aggregatedObservationData[qIdx].yes += question.yes || 0;
                        aggregatedObservationData[qIdx].no += question.no || 0;
                      }
                    });
                  }
                });
                currentObservationAnalysis = aggregatedObservationData;
              }
            }
          } else {
            currentObservationAnalysis = standardUserResponseData.observation[selectedSchool] || null;
          }
        }
        currentQuestionStatsAnalysis = null;
      }

      setObservationAnalysisData(currentObservationAnalysis);
      setQuestionStatsAnalysisData(currentQuestionStatsAnalysis);
    } else {
      setObservationAnalysisData(null);
      setQuestionStatsAnalysisData(null);
    }
  }, [
    selectedChapter,
    selectedSchool,
    userId,
    isAllChapterStructure,
    allChaptersResponseData,
    standardUserResponseData,
  ]);

  return (
    <div className="flex flex-col gap-6 mt-6 mb-10">
      {/* Chapter + School */}
      <div className="flex gap-4 items-end flex-wrap">
        {/* Chapter Field/Dropdown */}
        <div className="w-[650px]">
          <label className="block text-sm font-medium mb-1">Chapter</label>
          {isAllChapterStructure ? (
            <select
              className="p-2 border rounded-lg w-full"
              value={selectedChapter}
              onChange={(e) => {
                setSelectedChapter(e.target.value);
                setSelectedSchool("");
              }}
              disabled={
                !userId ||
                !allChaptersResponseData?.chapters ||
                Object.keys(allChaptersResponseData.chapters).length === 0
              }
            >
              <option value="">Select a chapter</option>
              {allChaptersResponseData?.chapters &&
                Object.keys(allChaptersResponseData.chapters).map((chapterName, index) => (
                  <option key={chapterName || index} value={chapterName}>
                    {chapterName}
                  </option>
                ))}
            </select>
          ) : (
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
            onChange={(e) => setSelectedSchool(e.target.value)}
            disabled={!selectedChapter || schools.length === 0}
          >
            <option value="">Select a school</option>
            {schools.includes("All Schools") && <option value="All Schools">All Schools</option>}
            {schools
              .filter((school) => school !== "All Schools")
              .map((school, index) => (
                <option key={school || index} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render QuestionMatrix with processed data */}
      <QuestionMatrix
        observationAnalysisData={observationAnalysisData}
        questionStatsAnalysisData={questionStatsAnalysisData}
      />

      {/* ResponseBoxes section */}
      <div className="flex items-end gap-4 mb-2">
        <div className="flex flex-col w-[220px]">
          <div className="rounded-lg w-full font-medium"></div>
        </div>
        <div className="flex-1">
          <ResponseBoxes count={8} />
        </div>
      </div>
    </div>
  );
};

export default SchoolSelector;