import React, { useState } from "react";
import Header from "../components/Header";
import ImageUploader from "../components/Image_Uploader";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
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
  "Did your driver have a license and insurance?",
];

const TOTAL_RIDES = 7;

const experienceQuestionsCount = 4;
const parentQuestionsCount = 2;

const QuestionTogglePage = () => {
  const [ridesAnswers, setRidesAnswers] = useState(
    Array(TOTAL_RIDES).fill(null).map(() => Array(questions.length).fill(false))
  );
  const [submittedRides, setSubmittedRides] = useState(Array(TOTAL_RIDES).fill(false));
  const [studentInfo, setStudentInfo] = useState({
    name: "",
    class: "",
    chapter: "",
    school: "",
    email: ""
  });
  const [parentRideAnswers, setParentRideAnswers] = useState(Array(TOTAL_RIDES).fill(false));
  const [experienceAnswers, setExperienceAnswers] = useState(Array(experienceQuestionsCount).fill(false));
  const [parentZoneAnswers, setParentZoneAnswers] = useState(Array(parentQuestionsCount).fill(false));
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [rideActive, setRideActive] = useState(Array(TOTAL_RIDES).fill(false));
  const [submitted, setSubmitted] = useState(false);

  const handleToggle = (rideIdx, questionIdx) => {
    if (!isStudentInfoComplete) {
      alert('Please fill in all student information before answering.');
      return;
    }
    if (!rideActive[rideIdx]) {
      alert('Activate this ride by checking the box before answering.');
      return;
    }
    if (submittedRides[rideIdx]) return;
    const updatedAnswers = [...ridesAnswers];
    updatedAnswers[rideIdx][questionIdx] = !updatedAnswers[rideIdx][questionIdx];
    setRidesAnswers(updatedAnswers);
  };

  const handleParentToggle = (rideIdx) => {
    if (!isStudentInfoComplete) {
      alert('Please fill in all student information before answering.');
      return;
    }
    if (!rideActive[rideIdx]) {
      alert('Activate this ride by checking the box before answering.');
      return;
    }
    if (submittedRides[rideIdx]) return;
    const updatedParentAnswers = [...parentRideAnswers];
    updatedParentAnswers[rideIdx] = !updatedParentAnswers[rideIdx];
    setParentRideAnswers(updatedParentAnswers);
  };

  const handleRideCheckbox = (idx) => {
    setRideActive((prev) => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  const handleSubmit = async () => {
    const updatedSubmitted = submittedRides.map(() => true);
    setSubmittedRides(updatedSubmitted);
    await sendAnswersToBackend();
    setSubmitted(true);
    alert('Submitted successfully!');
  };

  const handleDownloadCertificate = async () => {
    if (!rideActive.every(Boolean)) {
      alert('Please complete all seven rides before generating the certificate.');
      return;
    }
    const pdfBlob = await generateAndDownloadCertificate();
    await sendCertificateToEmail(pdfBlob);
  };

  const sendAnswersToBackend = async () => {
    // Prepare answers in the required format
    const data = {
      email: studentInfo.email,
      chapter: studentInfo.chapter,
      name: studentInfo.name,
      school: studentInfo.school,
      class_: studentInfo.class,
    };

    // Filter ridesAnswers and parentRideAnswers based on rideActive state
    const activeRidesAnswers = ridesAnswers.filter((_, rideIdx) => rideActive[rideIdx]);
    const activeParentRideAnswers = parentRideAnswers.filter((_, rideIdx) => rideActive[rideIdx]);

    // Main questions (q1 to q12) - process only active rides
    for (let q = 0; q < questions.length; q++) {
      data[`q${q + 1}`] = activeRidesAnswers.map((ride) => ride[q] ? 1 : 0);
    }

    // Parent toggles (q13) - process only active rides
    data["q13"] = activeParentRideAnswers.map((v) => v ? 1 : 0);

    // Experience zone (c1-c4) and Parent zone (c5) - these are not ride-specific, send them as is
    for (let i = 0; i < experienceAnswers.length; i++) {
      data[`c${i + 1}`] = experienceAnswers[i] ? 1 : 0;
    }
    data["c5"] = parentZoneAnswers[0] ? 1 : 0;

    try {
      await axios.post("https://chotacop.in/api/upload", data, {
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      alert("Failed to submit data: " + (err.response?.data?.detail || err.message));
    }
  };

  const generateAndDownloadCertificate = async () => {
    const { name, school, class: studentClass, chapter } = studentInfo;
    const tempDiv = document.createElement("div");
    tempDiv.className =
      "relative w-[1123px] h-[794px] bg-white shadow-lg border rounded-lg overflow-hidden";
    tempDiv.style.width = "1123px";
    tempDiv.style.height = "794px";
    // Load Shrikhand and Canvas Sans fonts
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
        ${name}
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
    await new Promise((resolve) => setTimeout(resolve, 400)); // Wait for image and fonts to load
    return html2canvas(tempDiv, { scale: 3, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "px", [1123, 794]);
      pdf.addImage(imgData, "PNG", 0, 0, 1123, 794);
      pdf.save("ChotaCop_Certificate.pdf");
      document.body.removeChild(tempDiv);
      // Return a PDF blob with the correct MIME type
      return pdf.output("blob");
    });
  };

  const sendCertificateToEmail = async (pdfBlob) => {
    // Convert the blob to a File object for form-data
    const file = new File([pdfBlob], "ChotaCop_Certificate.pdf", { type: "application/pdf" });
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", studentInfo.email);
    try {
      await axios.post("https://chotacop.in/api/send-pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (err) {
      alert("Failed to send certificate to email: " + (err.response?.data?.detail || err.message));
    }
  };

  const handleInputChange = (e) => {
    setStudentInfo({
      ...studentInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCheckEmail = async () => {
    const email = studentInfo.email.trim();
    if (!email) return alert("Please enter an email.");
    setCheckingEmail(true);
    try {
      const res = await axios.post("https://chotacop.in/api/check-mail", { email }, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.data.exists) {
        // Fetch full data for this email
        const dataRes = await axios.post("https://chotacop.in/api/email-data", { email }, {
          headers: { "Content-Type": "application/json" },
        });
        const info = dataRes.data.data && dataRes.data.data[0];
        if (info) {
          setStudentInfo((prev) => ({
            ...prev,
            name: info.name || prev.name,
            class: info.class || info.class_ || prev.class,
            chapter: info.chapter || prev.chapter,
            school: info.school || prev.school,
            email: email
          }));
          if (info.q1) {
            const newRidesAnswers = Array(TOTAL_RIDES).fill(null).map(() => Array(questions.length).fill(false));
            for (let q = 0; q < questions.length; q++) {
              const arr = info[`q${q + 1}`];
              if (Array.isArray(arr)) {
                for (let rideIdx = 0; rideIdx < arr.length; rideIdx++) {
                  newRidesAnswers[rideIdx][q] = arr[rideIdx] === 1;
                }
              }
            }
            setRidesAnswers(newRidesAnswers);
          }
          if (info.q13) {
            setParentRideAnswers(info.q13.map((v) => v === 1));
          }
          setExperienceAnswers([
            info.c1 === 1,
            info.c2 === 1,
            info.c3 === 1,
            info.c4 === 1
          ]);
          setParentZoneAnswers([
            info.c5 === 1,
            false
          ]);
          alert("Email already exists. Click OK to get your datas.");
        } else {
          alert("Email found but no data to fill.");
        }
      } else {
        alert("Email not found in database.");
      }
    } catch {
      alert("Error checking email. Please try again.");
    }
    setCheckingEmail(false);
  };

  const isStudentInfoComplete = Object.values(studentInfo).every((v) => v.trim() !== "");

  const handleDownloadReportCard = () => {
    const link = document.createElement('a');
    link.href = '/assets/Final Card.pdf'; // Path to your PDF file in the public directory
    link.download = 'ChotaCop_ReportCard.pdf'; // Suggested filename for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#fdf5eb]">
      <Header hideAuthLinks={true} showHomeOnQuestions={true} />
      <div className="w-full max-w-8xl mx-auto p-6 md:p-10">
        {/* Student Info Form */}
        <div className="bg-[#fdf6bf] shadow-xl rounded-2xl p-6 mb-8 mt-[-40px]">
          <div className="flex flex-wrap gap-6 justify-between items-center">
            <div className="flex items-center gap-2 flex-1 min-w-[180px]">
              <input type="email" name="email" placeholder="Email" value={studentInfo.email} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              <button
                type="button"
                onClick={handleCheckEmail}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                disabled={checkingEmail}
                title="Check Email"
              >
                {checkingEmail ? "Checking..." : "Check"}
              </button>
            </div>
            <select name="chapter" value={studentInfo.chapter} onChange={handleInputChange} className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-4 py-2">
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
            <input type="text" name="name" placeholder="Name" value={studentInfo.name} onChange={handleInputChange} className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-4 py-2" />
            <input type="text" name="school" placeholder="School" value={studentInfo.school} onChange={handleInputChange} className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-4 py-2" />
            {/* Wrap Class and Button for mobile side-by-side layout */}
            <div className="flex items-center gap-4 flex-1 min-w-[180px]">
              <select name="class" value={studentInfo.class} onChange={handleInputChange} className="flex-initial w-32 border border-gray-300 rounded-lg px-4 py-2">
                <option value="">Select Class</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{`Class ${i + 1}`}</option>
                ))}
              </select>
              {/* Chota Cop Report Card Button */}
              <button
                type="button"
                onClick={handleDownloadReportCard}
                className="px-2 py-2 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition"
                title="Download Chota Cop Report Card"
              >
                Chota Cop Card
              </button>
            </div>
          </div>
        </div>

        {/* Were you riding with a parent? */}
        <div className="bg-[#fdf5eb] shadow-xl rounded-2xl p-4 mb-8">
          <div className="hidden md:flex items-center">
            <p className="text-gray-800 font-semibold text-base mr-8 min-w-[260px]">Were you riding with a parent?</p>
            <div className="flex items-center gap-20 ml-[215px]">
              {Array.from({ length: TOTAL_RIDES }, (_, rideIdx) => {
                const isAnswered = parentRideAnswers[rideIdx];
                return (
                  <div
                    key={rideIdx}
                    onClick={() => handleParentToggle(rideIdx)}
                    className={`relative w-14 h-6 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${
                      isAnswered ? "bg-green-500" : "bg-red-500"
                    }`}
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
                const isAnswered = parentRideAnswers[rideIdx];
                return (
                  <div
                    key={rideIdx}
                    onClick={() => handleParentToggle(rideIdx)}
                    className={`relative w-12 h-5 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${
                      isAnswered ? "bg-green-500" : "bg-red-500"
                    }`}
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

        {/* MOBILE VIEW */}
        <div className="md:hidden bg-[#fdf5eb] shadow-xl rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2 font-bold text-gray-600 text-sm">
            {/* <span className="w-16">Ride</span>  */}
            {Array.from({ length: TOTAL_RIDES }, (_, i) => (
              <span key={i} className="w-12 text-center flex items-center justify-center gap-1">
                {i + 1}
                <input
                  type="checkbox"
                  checked={rideActive[i]}
                  onChange={() => handleRideCheckbox(i)}
                  className="accent-red-600 w-4 h-4"
                />
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
                  const isAnswered = ridesAnswers[rideIdx][qIdx];
                  return (
                    <div
                      key={rideIdx}
                      onClick={() => handleToggle(rideIdx, qIdx)}
                      className={`relative w-10 h-5 rounded-full cursor-pointer transition-colors duration-300 flex items-center px-1 ${
                        isAnswered ? "bg-green-500" : "bg-red-500"
                      }`}
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

        {/* DESKTOP VIEW */}
        <div className="overflow-auto hidden md:block">
          <table className="table-auto w-full border-collapse bg-[#fdf5eb] shadow-xl rounded-2xl overflow-hidden">
            <thead className="bg-[#fdf6bf]">
              <tr>
                <th className="text-left p-4 text-gray-700">Questions</th>
                {Array.from({ length: TOTAL_RIDES }, (_, i) => (
                  <th key={i} className="text-center p-4 text-gray-700">
                    <div className="flex items-center justify-center gap-2">
                      {`Ride ${i + 1}`}
                      <input
                        type="checkbox"
                        checked={rideActive[i]}
                        onChange={() => handleRideCheckbox(i)}
                        className="accent-red-600 w-4 h-4"
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Main Questions */}
              {questions.map((question, qIdx) => (
                <tr key={qIdx} className="border-t">
                  <td className="p-4 text-sm font-medium text-gray-800">{question}</td>
                  {Array.from({ length: TOTAL_RIDES }, (_, rideIdx) => {
                    const isAnswered = ridesAnswers[rideIdx][qIdx];
                    return (
                      <td key={rideIdx} className="p-4 text-center">
                        <div
                          onClick={() => handleToggle(rideIdx, qIdx)}
                          className={`relative w-14 h-6 rounded-full cursor-pointer transition-colors duration-300 mx-auto flex items-center px-1 ${
                            isAnswered ? "bg-green-500" : "bg-red-500"
                          }`}
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

        {/* Experience Zone */}
        <Ex_Zone
          answers={experienceAnswers}
          setAnswers={setExperienceAnswers}
          parentAnswers={parentZoneAnswers}
          setParentAnswers={setParentZoneAnswers}
          disabled={!rideActive.every(Boolean)}
        />

        {/* PDF Upload */}
        <ImageUploader />

        {/* Submit Button */}
        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={handleSubmit}
            disabled={!isStudentInfoComplete}
            className={`px-6 py-3 rounded-xl font-bold text-white transition-colors duration-300 ${
              isStudentInfoComplete ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
          <button
            onClick={handleDownloadCertificate}
            disabled={!submitted || !rideActive.every(Boolean)}
            className={`px-6 py-3 rounded-xl font-bold text-white transition-colors duration-300 ${
              submitted && rideActive.every(Boolean)
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionTogglePage;



