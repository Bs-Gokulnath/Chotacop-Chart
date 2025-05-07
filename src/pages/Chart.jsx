import React, { useState } from "react";
import Header from "../components/Header";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CHAPTERS = [
  "Vellore",
  "Bhopal",
  "Salem",
];

const VELLORE_SCHOOLS = [
  "MOTHER SCHOOL",
  "VANI VIDYALAYA SCHOOL",
  "RBMS SCHOOL",
  "SHRISHTI SCHOOL"
];

// Questions (same for all schools)
const questions = [
  "Rider & pillion wear helmet (2W)",
  "Car: seat belt worn",
  "Excessive honking",
  "Follow traffic signal",
  "Stop at stop line (red signal)",
  "Use cell phone while riding/driving",
  "Frequently changed lanes",
  "Drive in no entry",
  "Give way to pedestrians",
  "Auto: overloaded",
  "2W: triple ride",
  "Driving licence & insurance"
];

// Data for Shrishti School
const shrishtiYes = [85, 82, 45, 92, 88, 43, 35, 28, 83, 34, 45, 91];
const shrishtiNo  = [15, 18, 55, 8, 12, 57, 65, 72, 17, 66, 55, 9];

// Data for RBMS School (Rathinagiri Bageerathan Matric Hr Sec School)
const rbmsYes = [80, 70, 39, 87, 86, 33, 43, 34, 76, 45, 53, 87];
const rbmsNo  = [20, 30, 61, 13, 14, 67, 57, 66, 24, 55, 47, 13];

// Data for Mother School (Mother Matric Hr Sec School, Kalavai)
const motherYes = [60, 65, 35, 83, 89, 45, 74, 24, 87, 64, 77, 82];
const motherNo  = [40, 35, 65, 17, 11, 55, 26, 76, 13, 36, 23, 18];

// Data for Vani Vidyalaya School (from your image)
const vaniYes = [76, 86, 65, 88, 92, 73, 58, 45, 76, 43, 62, 86];
const vaniNo  = [24, 14, 35, 12, 8, 27, 42, 55, 24, 57, 38, 14];

const Chart = () => {
  const [selectedChapter, setSelectedChapter] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");

  // Reset school if chapter changes
  const handleChapterChange = (e) => {
    setSelectedChapter(e.target.value);
    setSelectedSchool("");
  };

  // Chart.js data and options
  let barData = null;
  let barOptions = null;

  if (selectedChapter === "Vellore" && selectedSchool === "SHRISHTI SCHOOL") {
    barData = {
      labels: questions,
      datasets: [
        {
          label: "Yes (%)",
          data: shrishtiYes,
          backgroundColor: "rgba(99, 102, 241, 0.7)", // purple-600
        },
        {
          label: "No (%)",
          data: shrishtiNo,
          backgroundColor: "rgba(239, 68, 68, 0.7)", // red-500
        },
      ],
    };
    barOptions = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Shrishti Vidhyashram Sr. Sec. School - Road Safety Survey",
        },
      },
      scales: {
        x: {
          ticks: { autoSkip: false, maxRotation: 60, minRotation: 30 },
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "Percentage (%)" },
        },
      },
    };
  } else if (selectedChapter === "Vellore" && selectedSchool === "RBMS SCHOOL") {
    barData = {
      labels: questions,
      datasets: [
        {
          label: "Yes (%)",
          data: rbmsYes,
          backgroundColor: "rgba(99, 102, 241, 0.7)", // purple-600
        },
        {
          label: "No (%)",
          data: rbmsNo,
          backgroundColor: "rgba(239, 68, 68, 0.7)", // red-500
        },
      ],
    };
    barOptions = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Rathinagiri Bageerathan Matric Hr Sec School - Road Safety Survey",
        },
      },
      scales: {
        x: {
          ticks: { autoSkip: false, maxRotation: 60, minRotation: 30 },
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "Percentage (%)" },
        },
      },
    };
  } else if (selectedChapter === "Vellore" && selectedSchool === "MOTHER SCHOOL") {
    barData = {
      labels: questions,
      datasets: [
        {
          label: "Yes (%)",
          data: motherYes,
          backgroundColor: "rgba(99, 102, 241, 0.7)", // purple-600
        },
        {
          label: "No (%)",
          data: motherNo,
          backgroundColor: "rgba(239, 68, 68, 0.7)", // red-500
        },
      ],
    };
    barOptions = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Mother Matric Hr Sec School, Kalavai - Road Safety Survey",
        },
      },
      scales: {
        x: {
          ticks: { autoSkip: false, maxRotation: 60, minRotation: 30 },
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "Percentage (%)" },
        },
      },
    };
  } else if (selectedChapter === "Vellore" && selectedSchool === "VANI VIDYALAYA SCHOOL") {
    barData = {
      labels: questions,
      datasets: [
        {
          label: "Yes (%)",
          data: vaniYes,
          backgroundColor: "rgba(99, 102, 241, 0.7)", // purple-600
        },
        {
          label: "No (%)",
          data: vaniNo,
          backgroundColor: "rgba(239, 68, 68, 0.7)", // red-500
        },
      ],
    };
    barOptions = {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: {
          display: true,
          text: "Vani Vidyalaya CBSE School - Road Safety Survey",
        },
      },
      scales: {
        x: {
          ticks: { autoSkip: false, maxRotation: 60, minRotation: 30 },
        },
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: "Percentage (%)" },
        },
      },
    };
  }

  return (
    <div className="min-h-screen bg-[#fdf5eb] flex flex-col">
      {/* Header on top */}
      <div className="w-full z-10">
        <Header />
      </div>

      {/* Centered content below header */}
      <div className="flex flex-grow items-center justify-center px-4 py-10 mt-[-130px]">
        <div className="bg-[#fdf5eb] shadow-xl p-8 rounded-xl w-full max-w-3xl space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">Select Chapter</h2>
          <div>
            <label className="block text-gray-700 mb-1">Chapter Name</label>
            <select
              value={selectedChapter}
              onChange={e => {
                setSelectedChapter(e.target.value);
                setSelectedSchool("");
              }}
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="">Select Chapter</option>
              {CHAPTERS.map(ch => (
                <option
                  key={ch}
                  value={ch}
                  disabled={selectedChapter && selectedChapter !== ch}
                >
                  {ch}
                </option>
              ))}
            </select>
          </div>
          {selectedChapter === "Vellore" && (
            <div className="mt-6">
              <label className="block text-gray-700 mb-1">School Name</label>
              <select
                value={selectedSchool}
                onChange={e => setSelectedSchool(e.target.value)}
                className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select School</option>
                {VELLORE_SCHOOLS.map(school => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </select>
            </div>
          )}
          {barData && barOptions && (
            <div className="mt-10">
              <Bar data={barData} options={barOptions} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chart;
