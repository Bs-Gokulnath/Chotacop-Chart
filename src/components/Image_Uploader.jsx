import React, { useRef, useState } from "react";

const ImageUploader = ({ onFileChange }) => {
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef();

  const handleFileChange = (e) => {
    setError("");
    setFileName("");
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      inputRef.current.value = "";
      return;
    }
    if (file.size > 1024 * 1024) {
      setError("File size must be less than 1MB.");
      inputRef.current.value = "";
      return;
    }
    setFileName(file.name);
    if (onFileChange) onFileChange(file);
  };

  return (
    <div className="bg-[#fdf6bf] shadow-xl rounded-2xl p-6 mb-8 mt-6">
      <label className="block mb-3 text-gray-800 font-semibold text-base">Upload your ChotaCop Card (max 1MB)</label>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg px-4 py-2 bg-[#fdf5eb] focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
      />
      {fileName && <div className="mt-3 text-green-700 text-sm font-medium">Selected: {fileName}</div>}
      {error && <div className="mt-3 text-red-600 text-sm font-medium">{error}</div>}
    </div>
  );
};

export default ImageUploader;
