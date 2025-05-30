import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Ex_Zone from "../components/Ex_Zone";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import * as XLSX from 'xlsx';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
  "Did your driver have a license and insurance?",
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

const ExcelUploaderPlaceholder = ({ disabled, onNamesExtracted }) => {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const names = json.slice(1).map(row => row[0]).filter(name => name);

        if (names.length > 0) {
          onNamesExtracted(names);
          alert(`${names.length} names extracted successfully.`);
        } else {
          onNamesExtracted([]);
          alert('No names found in the first column after the header row.');
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
        onNamesExtracted([]);
    }
  };

  return (
    <div className={`flex-1 min-w-[180px] ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <label className="block text-sm font-medium mb-1">Upload Names (Excel)</label>
      <input
        type="file"
        accept=".xls,.xlsx"
        className="w-full border border-gray-300 rounded-lg px-4 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        disabled={disabled}
        onChange={handleFileUpload}
      />
    </div>
  );
};

const PreviewModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
                <h3 className="text-lg font-bold mb-4">Expected Excel Format</h3>
                <p className="mb-4">Your Excel file should have student names in the **first column** (Column A), starting from the **second row**. The first row can be used for a header like "Name".</p>
                <div className="bg-gray-100 p-4 rounded mb-4">
                    <p className="font-semibold">Example:</p>
                    <table className="table-auto border-collapse">
                        <thead>
                            <tr>
                                <th className="border px-4 py-2 text-left">A</th>
                                {/* <th className="border px-4 py-2 text-left">B</th>
                                <th className="border px-4 py-2 text-left">C</th>
                                <th className="border px-4 py-2 text-left">D</th> */}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">Name</td>
                                {/* <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td> */}
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Student Name1</td>
                                {/* <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td> */}
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Student Name2</td>
                                {/* <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td> */}
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Student Name3</td>
                                {/* <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td> */}
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Student Name4</td>
                                {/* <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td> */}
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Student Name5</td>
                                {/* <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td>
                                <td className="border px-4 py-2"></td> */}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

const Bulk_Submit = () => {
  const [submissionsCount, setSubmissionsCount] = useState(1);
  const [currentSubmissionIndex, setCurrentSubmissionIndex] = useState(0);
  const [allSubmissionsData, setAllSubmissionsData] = useState([createEmptySubmission()]);
  const [studentInfo, setStudentInfo] = useState({
    chapter: "",
    school: "",
    class: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [studentNames, setStudentNames] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
        setCurrentSubmissionIndex(prevIndex => Math.min(prevIndex, count - 1));
        return newData;
      });
    }
  }, [submissionsCount]);

  useEffect(() => {
    if (studentNames.length === 0) {
        const count = parseInt(submissionsCount, 10);
        if (isNaN(count) || count <= 0) {
          setAllSubmissionsData([createEmptySubmission()]);
          setCurrentSubmissionIndex(0);
        } else {
          setAllSubmissionsData(prevData => {
            const newData = Array(count).fill(null).map((_, idx) =>
              prevData[idx] || createEmptySubmission()
            );
            setCurrentSubmissionIndex(prevIndex => Math.min(prevIndex, count - 1));
            return newData;
          });
        }
    }
  }, [submissionsCount, studentNames.length]);

  useEffect(() => {
      if (studentNames.length > 0) {
          const count = studentNames.length;
          setSubmissionsCount(count);
          setAllSubmissionsData(prevData => {
              const newData = Array(count).fill(null).map((_, idx) =>
                prevData[idx] || createEmptySubmission()
              );
              if (prevData.length > count) {
                  return newData.slice(0, count);
              }
              return newData;
          });
          setCurrentSubmissionIndex(prevIndex => Math.min(prevIndex, count - 1));
      } else if (submissionsCount === allSubmissionsData.length) {
           if (parseInt(submissionsCount, 10) <= 0 || submissionsCount === '') {
               setAllSubmissionsData([createEmptySubmission()]);
               setCurrentSubmissionIndex(0);
           }
      }
  }, [studentNames]);

  const currentSubmission = allSubmissionsData[currentSubmissionIndex];

  const handleToggle = (rideIdx, questionIdx) => {
    if (!isStudentInfoComplete) {
      alert('Please fill in chapter, school, and class information before answering.');
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
      alert('Please fill in chapter, school, and class information before answering.');
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
      alert('Please fill in chapter, school, and class information before answering.');
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
      alert('Please fill in chapter, school, and class information before answering.');
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

  const generateCertificateBlob = async (studentName, studentInfo) => {
    const { school, class: studentClass, chapter } = studentInfo;
    const tempDiv = document.createElement("div");
    tempDiv.className =
      "relative w-[1123px] h-[794px] bg-white shadow-lg border rounded-lg overflow-hidden";
    tempDiv.style.width = "1123px";
    tempDiv.style.height = "794px";
    // Load Shrikhand and Canvas Sans fonts
    // Ensure these fonts are accessible (e.g., linked in index.html or here)
    tempDiv.innerHTML = `
      <link href="https://fonts.googleapis.com/css2?family=Shrikhand&display=swap" rel="stylesheet">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Shrikhand&display=swap');
        .shrikhand { font-family: 'Shrikhand', cursive; }
        .canvas-sans { font-family: 'Arial', 'Helvetica Neue', Helvetica, 'Canvas Sans', sans-serif; }
      </style>
      <img src="/assets/Certificate Blank.png" 
           alt="Certificate" 
           style="width: 1123px; height: 794px; object-fit: cover; position: absolute; left: 0; top: 0;"/>
      <div class="canvas-sans" style="position: absolute; top: 246px; left: 90px; font-size: 50px; font-weight: bold; color: #F7931E;">
        Congratulations!
      </div>
      <div class="canvas-sans" style="position: absolute; top: 320px; left: 90px; font-size: 24px; color: #888;">
        This is to certify
      </div>
      <div class="shrikhand" style="position: absolute; top: 344px; left: 90px; font-size: 40px; color: #2d1a4a;">
        ${studentName}
      </div>
      <div class="canvas-sans" style="position: absolute; top: 410px; left: 90px; font-size: 24px; color: #888;">
        of ${school}
      </div>
      <div class="canvas-sans" style="position: absolute; top: 440px; left: 90px; font-size: 24px; color: #888;">
        in class ${studentClass} at ${chapter}
      </div>
      <div class="canvas-sans" style="position: absolute; top: 470px; left: 90px; font-size: 24px; color: #888;">
        has successfully completed
      </div>
      <div class="canvas-sans" style="position: absolute; top: 510px; left: 90px; font-size: 32px; font-weight: bold; color: #222;">
        Yi Chotacop
      </div>
    `;
    document.body.appendChild(tempDiv);
    await new Promise(resolve => setTimeout(resolve, 2000));

    return html2canvas(tempDiv, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "px", [1123, 794]);
      pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);
        const pdfBlob = pdf.output("blob");
      document.body.removeChild(tempDiv);
        return pdfBlob;
    });
  };

const handleGenerateCertificates = async () => {
    if (!isStudentInfoComplete) {
        alert('Please fill in chapter, school, and class information and upload names before generating certificates.');
        return;
    }
    if (studentNames.length === 0) {
        alert('Please upload an Excel file with student names first.');
        return;
    }

    const zip = new JSZip();
    const certificatePromises = studentNames.map(async (name) => {
        try {
             const pdfBlob = await generateCertificateBlob(name, studentInfo);
             // Add PDF to zip
             zip.file(`${name}_ChotaCop_Certificate.pdf`, pdfBlob);
        } catch (error) {
             console.error(`Failed to generate certificate for ${name}:`, error);
             alert(`Failed to generate certificate for ${name}. See console for details.`);
        }
    });

    // Wait for all certificates to be generated and added to the zip
    await Promise.all(certificatePromises);

    // Generate the zip file
    zip.generateAsync({ type: "blob" })
        .then(function(content) {
            // Save the zip file
            saveAs(content, "ChotaCop_Certificates.zip");
            alert('Certificates generated and downloaded as a zip file.');
        })
        .catch(error => {
            console.error('Failed to create or download zip file:', error);
            alert('Failed to generate or download zip file.');
        });
};

  const handleSubmitAll = async () => {
    if (!isStudentInfoComplete) {
      alert('Please fill in chapter, school, and class information before submitting.');
      return;
    }
    if (!isLoggedIn) {
        alert('Please sign in to submit.');
        return;
    }
    if (studentNames.length === 0) {
        alert('Please upload an Excel file with student names before submitting.');
        return;
    }

    if (allSubmissionsData.some(sub => sub.isSubmitted)) {
      alert('Some submissions have already been submitted.');
      return;
    }

    const dataToSend = {
      chapter: studentInfo.chapter,
      school: studentInfo.school,
      class: studentInfo.class,
      submissions: [],
    };

    allSubmissionsData.forEach((submission, index) => {
      const submissionData = {};

      const studentName = studentNames[index] || `Student ${index + 1}`;
      submissionData.studentName = studentName;

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
      await axios.post("https://chotacop.in/api/bulk-upload", dataToSend, {
        headers: { "Content-Type": "application/json" },
      });

      setAllSubmissionsData(prevData => prevData.map(sub => ({ ...sub, isSubmitted: true })));
      alert(`Successfully submitted ${submissionsCount} submissions! Certificates can now be generated.`);

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

  const handleSubmissionsCountInputChange = (e) => {
    const value = e.target.value;
    setSubmissionsCount(value);
  };

  const handleNamesExtracted = (names) => {
      setStudentNames(names);
  };

  const handleNextSubmission = () => {
    if (!isStudentInfoComplete) {
      alert('Please fill in chapter, school, and class information before moving to the next.');
      return;
    }
    if (!isLoggedIn) {
        alert('Please sign in to proceed.');
        return;
    }
    if (currentSubmissionIndex < allSubmissionsData.length - 1) {
      setCurrentSubmissionIndex(prevIndex => prevIndex + 1);
    }
  };

  const handlePreviousSubmission = () => {
    if (currentSubmissionIndex > 0) {
      setCurrentSubmissionIndex(prevIndex => prevIndex - 1);
    }
  };

  const isStudentInfoComplete = studentInfo.chapter.trim() !== "" && studentInfo.school.trim() !== "" && studentInfo.class.trim() !== "" && studentNames.length > 0;
  const isSubmitAllButtonDisabled = !isLoggedIn || !isStudentInfoComplete || allSubmissionsData.some(sub => sub.isSubmitted) || studentNames.length === 0;
  const isGenerateCertificatesButtonDisabled = !isStudentInfoComplete || !allSubmissionsData.every(sub => sub.isSubmitted);

  return (
    <div className="min-h-screen bg-[#fdf5eb]">
      <Header hideAuthLinks={true} showHomeOnQuestions={true} />
      <div className="w-full max-w-8xl mx-auto p-6 md:p-10">
        <div className="bg-[#fdf6bf] shadow-xl rounded-2xl p-6 mb-8 mt-[-40px]">
          <div className="flex flex-wrap gap-6 items-center">
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
            <div className="w-40">
              <label className="block text-sm font-medium mb-1">Class</label>
              <input type="text" name="class" placeholder="Class" value={studentInfo.class} onChange={handleStudentInfoChange} className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isLoggedIn}
              />
            </div>
            <div className="w-48">
              <label className="block text-sm font-medium mb-1">Number of Submissions</label>
              <input
                type="number"
                name="submissionsCount"
                min="1"
                value={submissionsCount}
                onChange={handleSubmissionsCountInputChange}
                className={`w-full border border-gray-300 rounded-lg px-4 py-2 ${!isLoggedIn || studentNames.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isLoggedIn || studentNames.length > 0}
              />
            </div>
            <div className="flex-1 min-w-[180px] flex items-end gap-2">
                <ExcelUploaderPlaceholder disabled={!isLoggedIn} onNamesExtracted={handleNamesExtracted} />
                 <button
                     onClick={() => setShowPreviewModal(true)}
                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center text-sm font-semibold"
                      disabled={!isLoggedIn}
                      title="Preview Excel Format"
                  >
                      View Sample
                  </button>
             </div>
          </div>
        </div>

        {currentSubmission && (
          <div className="mb-12 border-t-4 border-blue-500 pt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Submission {currentSubmissionIndex + 1} of {allSubmissionsData.length}</h3>

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
              disabled={!isStudentInfoComplete || currentSubmission.isSubmitted || !isLoggedIn}
              handleExperienceToggle={handleExperienceToggle}
              handleParentZoneToggle={handleParentZoneToggle}
            />

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

          {currentSubmissionIndex < allSubmissionsData.length - 1 && (
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

          {currentSubmissionIndex === allSubmissionsData.length - 1 && allSubmissionsData.length > 0 && (
          <button
              onClick={handleSubmitAll}
              disabled={isSubmitAllButtonDisabled}
            className={`px-6 py-3 rounded-xl font-bold text-white transition-colors duration-300 ${
                !isSubmitAllButtonDisabled ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
              Submit All Submissions
          </button>
          )}

          <button
              onClick={handleGenerateCertificates}
              disabled={isGenerateCertificatesButtonDisabled}
            className={`px-6 py-3 rounded-xl font-bold text-white transition-colors duration-300 ${
                  !isGenerateCertificatesButtonDisabled ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
              Generate Certificates
          </button>

        </div>
      </div>
       <PreviewModal show={showPreviewModal} onClose={() => setShowPreviewModal(false)} />
    </div>
  );
};

export default Bulk_Submit;



