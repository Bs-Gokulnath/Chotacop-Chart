import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ImageUploader from "../components/Image_Uploader";
import Ex_Zone from "../components/Ex_Zone";
import axios from "axios";

const questions = [
  "If on a bike or scooter, did everyone wear a helmet?",
  "If in a car, did everyone wear a seatbelt?",
  "Did the driver honk too much?",
  "Did the driver follow traffic lights?",
  "At a red light, did the driver stop at the white line?",
  "Did the driver use a phone while driving?",
  "Did the driver keep changing lanes?",
  "Did the driver go into a \"No Entry\" road?",
  "Did the driver stop for people walking (pedestrians)?",
  "If in an auto, were too many people sitting inside?",
  "If on a two-wheeler, were three people riding on it?",
  "Did your rider/driver have driving licence and insurrance?",
];

const TOTAL_RIDES = 10;

const experienceQuestionsCount = 4;
const parentQuestionsCount = 2;

const createEmptySubmission = () => ({
  ridesAnswers: Array(TOTAL_RIDES).fill(null).map(() => Array(questions.length).fill(false)),
  parentRideAnswers: Array(TOTAL_RIDES).fill(false),
  experienceAnswers: Array(experienceQuestionsCount).fill(false),
  parentZoneAnswers: Array(parentQuestionsCount).fill(false),
  isSubmitted: false,
});

const Bulk_Submit = () => {
  const [submissionsCount, setSubmissionsCount] = useState(1);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
  const [allSubmissionsData, setAllSubmissionsData] = useState([createEmptySubmission()]);
  const [studentInfo, setStudentInfo] = useState({
    chapter: "",
    school: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);

    const count = parseInt(submissionsCount, 10);
    if (isNaN(count) || count <= 0) {
      setAllSubmissionsData([createEmptySubmission()]);
      setCurrentSubmissionIndex(0);
    } else {
      setAllSubmissionsData(prevData => {
        const newData = Array(count).fill(null).map((_, idx) =>
          prevData[idx] || createEmptySubmission()
        );
        return newData;
      });
      setCurrentSubmissionIndex(prevIndex => Math.min(prevIndex, count - 1));
    }
  }, [submissionsCount]);

  const currentSubmission = allSubmissionsData[currentSubmissionIndex];

  const handleToggle = (rideIdx, questionIdx) => {
    if (!isStudentInfoComplete) {
      alert('Please fill in chapter and school information before answering.');
      return;
    }
    if (!isLoggedIn) {
        alert('Please sign in to fill data.');
        return;
    }
    if (currentSubmission.isSubmitted) return;

    setAllSubmissionsData(prevData => {
      const newData = [...prevData];
      const updatedSubmission = { ...newData[currentSubmissionIndex] };
      const updatedRidesAnswers = [...updatedSubmission.ridesAnswers];
      updatedRidesAnswers[rideIdx] = [...updatedRidesAnswers[rideIdx]];
      updatedRidesAnswers[rideIdx][questionIdx] = !updatedRidesAnswers[rideIdx][questionIdx];
      updatedSubmission.ridesAnswers = updatedRidesAnswers;
      newData[currentSubmissionIndex] = updatedSubmission;
      return newData;
    });
  };

  const handleParentToggle = (rideIdx) => {
    if (!isStudentInfoComplete) {
      alert('Please fill in chapter and school information before answering.');
      return;
    }
    if (!isLoggedIn) {
        alert('Please sign in to fill data.');
        return;
    }
    if (currentSubmission.isSubmitted) return;

    setAllSubmissionsData(prevData => {
      const newData = [...prevData];
      const updatedSubmission = { ...newData[currentSubmissionIndex] };
      const updatedParentAnswers = [...updatedSubmission.parentRideAnswers];
      updatedParentAnswers[rideIdx] = !updatedParentAnswers[rideIdx];
      updatedSubmission.parentRideAnswers = updatedParentAnswers;
      newData[currentSubmissionIndex] = updatedSubmission;
      return newData;
    });
  };

  const handleExperienceToggle = (expIdx) => {
    if (!isStudentInfoComplete) {
      alert('Please fill in chapter and school information before answering.');
      return;
    }
    if (!isLoggedIn) {
        alert('Please sign in to fill data.');
        return;
    }
    if (currentSubmission.isSubmitted) return;

    setAllSubmissionsData(prevData => {
      const newData = [...prevData];
      const updatedSubmission = { ...newData[currentSubmissionIndex] };
      const updatedExperienceAnswers = [...updatedSubmission.experienceAnswers];
      updatedExperienceAnswers[expIdx] = !updatedExperienceAnswers[expIdx];
      updatedSubmission.experienceAnswers = updatedExperienceAnswers;
      newData[currentSubmissionIndex] = updatedSubmission;
      return newData;
    });
  };

  const handleParentZoneToggle = (parentZoneIdx) => {
    if (!isStudentInfoComplete) {
      alert('Please fill in chapter and school information before answering.');
      return;
    }
    if (!isLoggedIn) {
        alert('Please sign in to fill data.');
        return;
    }
    if (currentSubmission.isSubmitted) return;

    setAllSubmissionsData(prevData => {
      const newData = [...prevData];
      const updatedSubmission = { ...newData[currentSubmissionIndex] };
      const updatedParentZoneAnswers = [...updatedSubmission.parentZoneAnswers];
      updatedParentZoneAnswers[parentZoneIdx] = !updatedParentZoneAnswers[parentZoneIdx];
      updatedSubmission.parentZoneAnswers = updatedParentZoneAnswers;
      newData[currentSubmissionIndex] = updatedSubmission;
      return newData;
    });
  };

  const handleSubmitAll = async () => {
    if (!isStudentInfoComplete) {
      alert('Please fill in chapter and school information before submitting.');
      return;
    }
    if (!isLoggedIn) {
        alert('Please sign in to submit.');
        return;
    }

    if (allSubmissionsData.some(sub => sub.isSubmitted)) {
      alert('Some submissions have already been submitted.');
      return;
    }

    const dataToSend = {
      chapter: studentInfo.chapter,
      school: studentInfo.school,
      submissions: [],
    };

    allSubmissionsData.forEach((submission) => {
      const submissionData = {};

      for (let q = 0; q < questions.length; q++) {
        submissionData[`q${q + 1}`] = submission.ridesAnswers.map((ride) => ride[q] ? 1 : 0);
      }
      submissionData["q13"] = submission.parentRideAnswers.map((v) => v ? 1 : 0);
      for (let i = 0; i < experienceQuestionsCount; i++) {
        submissionData[`c${i + 1}`] = submission.experienceAnswers[i] ? 1 : 0;
      }
      submissionData["c5"] = submission.parentZoneAnswers[0] ? 1 : 0;

      dataToSend.submissions.push(submissionData);
    });

    try {
      await axios.post("http://148.135.137.228:5001/bulk-upload", dataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      setAllSubmissionsData(prevData => prevData.map(sub => ({ ...sub, isSubmitted: true })));
      alert(`Successfully submitted ${submissionsCount} submissions!`);

    } catch (err) {
      alert("Failed to submit data: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleStudentInfoChange = (e) => {
    setStudentInfo({
      ...studentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmissionsCountChange = (e) => {
    const value = e.target.value;
    setSubmissionsCount(value);
  };

  const handleNextSubmission = () => {
    if (!isStudentInfoComplete) {
      alert('Please fill in chapter and school information before moving to the next.');
      return;
    }
    if (!isLoggedIn) {
        alert('Please sign in to proceed.');
        return;
    }
    if (currentSubmissionIndex < submissionsCount - 1) {
      setCurrentSubmissionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousSubmission = () => {
    if (currentSubmissionIndex > 0) {
      setCurrentSubmissionIndex(prevIndex => prevIndex - 1);
    }
  };

  const isStudentInfoComplete = studentInfo.chapter.trim() !== "" && studentInfo.school.trim() !== "";
  const isSubmissionsCountValid = parseInt(submissionsCount, 10) > 0;

  const showSubmitAllButton = currentSubmissionIndex === parseInt(submissionsCount, 10) - 1;
  const isSubmitAllButtonDisabled = !isStudentInfoComplete || !isSubmissionsCountValid || allSubmissionsData.some(sub => sub.isSubmitted);

  return (
    <div className="min-h-screen bg-[#fdf5eb]">
      <Header hideAuthLinks={true} showHomeOnQuestions={true} />
      <div className="w-full max-w-8xl mx-auto p-6 md:p-10">
        <div className="bg-[#fdf6bf] shadow-xl rounded-2xl p-6 mb-8 mt-[-40px]">
          <div className="flex flex-wrap gap-6 items-center">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium mb-1">Number of Submissions</label>
              <input
                type="number"
                name="submissionsCount"
                min="1"
                value={submissionsCount}
                onChange={handleSubmissionsCountChange}
                className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isLoggedIn}
              />
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium mb-1">Chapter</label>
              <select name="chapter" value={studentInfo.chapter} onChange={handleStudentInfoChange} className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isLoggedIn}
              >
                <option value="">Select Chapter</option>
                <option value="Agra">Agra</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Ajmer">Ajmer</option>
                <option value="Amaravati">Amaravati</option>
                <option value="Balasore">Balasore</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Bhopal">Bhopal</option>
                <option value="Bhavnagar">Bhavnagar</option>
                <option value="Bhubaneswar">Bhubaneswar</option>
                <option value="Chandigarh">Chandigarh</option>
                <option value="Chennai">Chennai</option>
                <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Dehradun">Dehradun</option>
                <option value="Delhi">Delhi</option>
                <option value="Dindigul">Dindigul</option>
                <option value="Durg">Durg</option>
                <option value="Erode">Erode</option>
                <option value="Goa">Goa</option>
                <option value="Gurugram">Gurugram</option>
                <option value="Guwahati">Guwahati</option>
                <option value="Gwalior">Gwalior</option>
                <option value="Hosur">Hosur</option>
                <option value="Hubballi">Hubballi</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Indore">Indore</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Jabalpur">Jabalpur</option>
                <option value="Jamshedpur">Jamshedpur</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Karur">Karur</option>
                <option value="Kochi">Kochi</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Kota">Kota</option>
                <option value="Kozhikode">Kozhikode</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Madurai">Madurai</option>
                <option value="Mangaluru">Mangaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Nagpur">Nagpur</option>
                <option value="Nashik">Nashik</option>
                <option value="Noida">Noida</option>
                <option value="Puducherry">Puducherry</option>
                <option value="Pune">Pune</option>
                <option value="Raipur">Raipur</option>
                <option value="Rajkot">Rajkot</option>
                <option value="Ranchi">Ranchi</option>
                <option value="Salem">Salem</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Siliguri">Siliguri</option>
                <option value="Sivakasi">Sivakasi</option>
                <option value="Surat">Surat</option>
                <option value="Thoothukudi">Thoothukudi</option>
                <option value="Tirupur">Tirupur</option>
                <option value="Tirupur">Tirupati</option>
                <option value="Trichy">Trichy</option>
                <option value="Trivandrum">Trivandrum</option>
                <option value="Vadodara">Vadodara</option>
                <option value="Varanasi">Varanasi</option>
                <option value="Vellore">Vellore</option>
                <option value="Vizag">Vizag</option>
              </select>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium mb-1">School</label>
              <input type="text" name="school" placeholder="School" value={studentInfo.school} onChange={handleStudentInfoChange} className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isLoggedIn}
              />
            </div>
          </div>
        </div>

        {currentSubmission && (
          <div className="mb-12 border-t-4 border-blue-500 pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Submission {currentSubmissionIndex + 1} of {submissionsCount}</h3>

            <div className="bg-[#fdf5eb] shadow-xl rounded-2xl p-4 mb-8">
              <div className="hidden md:flex items-center">
                <p className="text-gray-800 font-semibold text-base mr-8 min-w-[260px]">Were you riding with a parent?</p>
                <div className="flex items-center gap-11 ml-[165px]">
                  {Array.from({ length: TOTAL_RIDES }, (_, rideIdx) => {
                    const isAnswered = currentSubmission.parentRideAnswers[rideIdx];
                    return (
                      <div
                        key={rideIdx}
                        onClick={() => handleParentToggle(rideIdx)}
                        className={`relative w-14 h-6 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${
                          isAnswered ? "bg-green-500" : "bg-red-500"
                        } ${!isStudentInfoComplete || currentSubmission.isSubmitted || !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isStudentInfoComplete || currentSubmission.isSubmitted || !isLoggedIn}
                      >
                        <span className="text-white text-xs font-bold w-1/2 text-center z-10">Y</span>
                        <span className="text-white text-xs font-bold w-1/2 text-center z-10">N</span>
                        <div
                          className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            isAnswered ? "translate-x-full" : "translate-x-0"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="md:hidden flex flex-col items-center gap-4">
                <p className="text-gray-800 font-semibold text-base mb-2 text-center">Were you riding with a parent?</p>
                <div className="flex flex-nowrap justify-center gap-3 overflow-x-auto w-full pb-2">
                  {Array.from({ length: TOTAL_RIDES }, (_, rideIdx) => {
                    const isAnswered = currentSubmission.parentRideAnswers[rideIdx];
                    return (
                      <div
                        key={rideIdx}
                        onClick={() => handleParentToggle(rideIdx)}
                        className={`relative w-12 h-5 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${
                          isAnswered ? "bg-green-500" : "bg-red-500"
                        } ${!isStudentInfoComplete || currentSubmission.isSubmitted || !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!isStudentInfoComplete || currentSubmission.isSubmitted || !isLoggedIn}
                      >
                        <div
                          className={`absolute w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                            isAnswered ? "translate-x-7" : "translate-x-0"
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="md:hidden bg-[#fdf5eb] shadow-xl rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2 font-bold text-gray-600 text-sm">
                {Array.from({ length: TOTAL_RIDES }, (_, i) => (
                  <span key={i} className="w-10 text-center flex items-center justify-center">
                    {i + 1}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                  <span className="text-xs text-gray-700">Yes</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                  <span className="text-xs text-gray-700">No</span>
                </div>
              </div>
              {questions.map((question, qIdx) => (
                <div key={qIdx} className="mb-4 border-t pt-4">
                  <p className="text-gray-800 font-medium text-sm mb-2">{question}</p>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: TOTAL_RIDES }, (_, rideIdx) => {
                      const isAnswered = currentSubmission.ridesAnswers[rideIdx][qIdx];
                      return (
                        <div
                          key={rideIdx}
                          onClick={() => handleToggle(rideIdx, qIdx)}
                          className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${
                            isAnswered ? "bg-green-500" : "bg-red-500"
                          } ${!isStudentInfoComplete || currentSubmission.isSubmitted || !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!isStudentInfoComplete || currentSubmission.isSubmitted || !isLoggedIn}
                        >
                          <div
                            className={`absolute w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                              isAnswered ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-auto hidden md:block">
              <table className="table-auto w-full border-collapse bg-[#fdf5eb] shadow-xl rounded-2xl overflow-hidden">
                <thead className="bg-[#fdf6bf]">
                  <tr>
                    <th className="text-left p-4 text-gray-700">Questions</th>
                    {Array.from({ length: TOTAL_RIDES }, (_, i) => (
                      <th key={i} className="text-center p-4 text-gray-700">
                        {`Ride ${i + 1}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, qIdx) => (
                    <tr key={qIdx} className="border-t">
                      <td className="p-4 text-sm font-medium text-gray-800">{question}</td>
                      {Array.from({ length: TOTAL_RIDES }, (_, rideIdx) => {
                        const isAnswered = currentSubmission.ridesAnswers[rideIdx][qIdx];
                        return (
                          <td key={rideIdx} className="p-4 text-center">
                            <div
                              onClick={() => handleToggle(rideIdx, qIdx)}
                              className={`relative w-14 h-6 rounded-full cursor-pointer transition-colors duration-300 mx-auto flex items-center px-1 ${
                                isAnswered ? "bg-green-500" : "bg-red-500"
                              } ${!isStudentInfoComplete || currentSubmission.isSubmitted || !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!isStudentInfoComplete || currentSubmission.isSubmitted || !isLoggedIn}
                            >
                              <span className="text-white text-xs font-bold w-1/2 text-center z-10">Y</span>
                              <span className="text-white text-xs font-bold w-1/2 text-center z-10">N</span>
                              <div
                                className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                                  isAnswered ? "translate-x-full" : "translate-x-0"
                                }`}
                              />
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Ex_Zone
              answers={currentSubmission.experienceAnswers}
              setAnswers={(answers) => setAllSubmissionsData(prev => {
                const newData = [...prev];
                newData[currentSubmissionIndex].experienceAnswers = answers;
                return newData;
              })}
              parentAnswers={currentSubmission.parentZoneAnswers}
              setParentAnswers={(answers) => setAllSubmissionsData(prev => {
                const newData = [...prev];
                newData[currentSubmissionIndex].parentZoneAnswers = answers;
                return newData;
              })}
              disabled={!isStudentInfoComplete || currentSubmission.isSubmitted}
              handleExperienceToggle={handleExperienceToggle}
              handleParentZoneToggle={handleParentZoneToggle}
            />

            <ImageUploader disabled={!isLoggedIn} />
          </div>
        )}

        <div className="flex justify-center mt-8 gap-4">
          {currentSubmissionIndex > 0 && (
            <button
              onClick={handlePreviousSubmission}
              className="px-6 py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
              disabled={!isLoggedIn}
            >
              Previous
            </button>
          )}

          {!showSubmitAllButton && (
            <button
              onClick={handleNextSubmission}
              disabled={!isStudentInfoComplete || currentSubmission?.isSubmitted || !isLoggedIn}
              className={`px-6 py-3 rounded-xl font-bold text-white transition-colors duration-300 ${
                isStudentInfoComplete && !currentSubmission?.isSubmitted && isLoggedIn
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Next Submission
            </button>
          )}

          {showSubmitAllButton && (
            <button
              onClick={handleSubmitAll}
              disabled={isSubmitAllButtonDisabled || !isLoggedIn}
              className={`px-6 py-3 rounded-xl font-bold text-white transition-colors duration-300 ${
                !isSubmitAllButtonDisabled && isLoggedIn ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Submit All Submissions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bulk_Submit;



