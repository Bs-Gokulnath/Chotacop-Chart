import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CertificateGenerator = () => {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [studentClass, setStudentClass] = useState("");

  const certificateRef = useRef(null);

  const generatePDF = () => {
    if (!name || !school || !studentClass) {
      alert("Please fill in all fields!");
      return;
    }

    const tempDiv = document.createElement("div");
    tempDiv.className =
      "relative w-[1123px] h-[794px] bg-white shadow-lg border rounded-lg overflow-hidden";
    tempDiv.innerHTML = `
      <img src="/assets/Chota Cop Certificate.png" 
           alt="Certificate" 
           class="w-full h-full object-cover"/>
      
      <div class="absolute top-[388px] left-[345px] text-xl font-bold text-black">${name}</div>
      <div class="absolute top-[458px] left-[340px] text-xs font-bold text-black">${school}</div>
      <div class="absolute top-[448px] left-[750px] text-xl font-bold text-black">${studentClass}</div>
    `;

    document.body.appendChild(tempDiv);

    html2canvas(tempDiv, { scale: 3 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("ChotaCop_Certificate.pdf");

      document.body.removeChild(tempDiv); // Clean up
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Form Container */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Enter Details
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">School</label>
          <input
            type="text"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Class</label>
          <input
            type="text"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={generatePDF}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          Download Certificate
        </button>
      </div>
    </div>
  );
};

export default CertificateGenerator;
