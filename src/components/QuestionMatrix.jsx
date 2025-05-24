import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const questions = [
  "If on Two wheeler did the rider and pillion wear helmet",
  "If in car did driver and passangers wear seat belt",
  "Did rider / driver do excessive Honking",
  "Did rider / driver follow traffic singal",
  "During red signal did rider / driver follow stop with stop line",
  "Did rider / driver use cell phone while riding/driving",
  "Did rider / driver frequently changed lanes",
  "Did rider / driver drive in no entry",
  "Did they give way to pedestrians",
  "If in auto did they over load the auto",
  "If you were on two wheeler did you triple ride",
  "Did your rider/driver have driving licence and insurrance",
];

const COLORS_ACTIVE = ["#4339F2", "#F2B705"];
const COLORS_INACTIVE = ["#A0A0A0", "#D0D0D0"];

const DonutChart = ({ data, isActive }) => {
  // Calculate percentages
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const yesData = data.find((item) => item.name === "Yes");
  const noData = data.find((item) => item.name === "No");

  const yesPercentage = total > 0 && yesData ? ((yesData.value / total) * 100).toFixed(0) : 0;
  const noPercentage = total > 0 && noData ? ((noData.value / total) * 100).toFixed(0) : 0;

  return (
    <div className={`relative ${isActive ? "" : "opacity-50"} group`}>
      <PieChart width={50} height={50}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={12}
          outerRadius={20}
          startAngle={180}
          endAngle={-180}
          dataKey="value"
          stroke="none"
          className={isActive ? "" : "opacity-50"}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={isActive ? COLORS_ACTIVE[index] : COLORS_INACTIVE[index]}
            />
          ))}
        </Pie>
      </PieChart>
      {/* Custom Tooltip/Hover Box */}
      {isActive && total > 0 && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          <p>{`Yes: ${yesPercentage}%`}</p>
          <p>{`No: ${noPercentage}%`}</p>
        </div>
      )}
    </div>
  );
};

const QuestionMatrix = ({ observationAnalysisData = null, questionStatsAnalysisData = null }) => {
  // Calculate total responses for Card Data (observationAnalysisData)
  const totalCardResponses = observationAnalysisData
    ? Math.max(...observationAnalysisData.map((item) => (item.yes || 0) + (item.no || 0)), 0)
    : 0;

  // Calculate total responses for each ride (from questionStatsAnalysisData)
  const totalRideResponses = questionStatsAnalysisData
    ? Math.max(
        ...questionStatsAnalysisData.map((q) =>
          Math.max(...q.rides.map((ride) => ride.total || 0))
        ),
        0
      )
    : 0;

  return (
    <div className="p-4 overflow-x-auto">
      {/* Top Header Row: Total Responses and Ride Numbers */}
      <div className="grid grid-cols-[300px_repeat(8,80px)] gap-12 items-center mb-1">
        <div className="font-bold text-lg text-black">Total Responses</div>
        {/* Card Data Total Responses */}
        <div className="text-center font-bold text-lg text-black">
          {observationAnalysisData ? totalCardResponses : "-"}
        </div>
        {/* Ride 1-7 Total Responses */}
        {Array.from({ length: 7 }).map((_, idx) => (
          <div key={idx + 1} className="text-center font-bold text-lg text-black">
            {questionStatsAnalysisData ? totalRideResponses : 0}
          </div>
        ))}
      </div>

      {/* Header Row: Questions and Ride Labels */}
      <div className="grid grid-cols-[300px_repeat(8,80px)] gap-12 items-center mb-3">
        <div className="font-semibold">Questions</div>
        {["Card Data", "Ride1", "Ride2", "Ride3", "Ride4", "Ride5", "Ride6", "Ride7"].map(
          (label, idx) => (
            <div key={idx} className="text-center font-semibold">
              {label}
            </div>
          )
        )}
      </div>

      {/* Data Rows: Question Text and Donut Charts */}
      {questions.map((q, qIdx) => {
        // Card Data for the first column (index 0)
        const cardQuestionData = observationAnalysisData
          ? observationAnalysisData.find((item) => item.q === q) || { yes: 0, no: 0 }
          : { yes: 0, no: 0 };
        const cardChartData = [
          { name: "Yes", value: cardQuestionData.yes || 0 },
          { name: "No", value: cardQuestionData.no || 0 },
        ];

        // Ride Data for columns 1-7 (indices 1-7)
        const rideQuestionData = questionStatsAnalysisData
          ? questionStatsAnalysisData.find((item) => item.qIndex === qIdx) || {
              rides: Array(7).fill({ yes: 0, no: 0 }),
            }
          : { rides: Array(7).fill({ yes: 0, no: 0 }) };
        const rideChartsData = rideQuestionData.rides.map((ride) => [
          { name: "Yes", value: ride.yes || 0 },
          { name: "No", value: ride.no || 0 },
        ]);

        return (
          <div
            key={qIdx}
            className="grid grid-cols-[300px_repeat(8,80px)] gap-12 items-center mb-6 group"
          >
            <div className="text-sm">{q}</div>
            {/* Card Data Column */}
            <div className="flex justify-center">
              <DonutChart data={cardChartData} isActive={!!observationAnalysisData} />
            </div>
            {/* Ride 1-7 Columns */}
            {Array.from({ length: 7 }).map((_, idx) => (
              <div key={idx + 1} className="flex justify-center">
                <DonutChart data={rideChartsData[idx]} isActive={!!questionStatsAnalysisData} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default QuestionMatrix;