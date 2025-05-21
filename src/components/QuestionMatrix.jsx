import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

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

const DonutChart = ({ data, isActive }) => (
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
    {isActive && (
      <Tooltip
        content={({ active, payload }) => {
          if (active && payload && payload.length) {
            const chartData = payload[0]?.payload.data;

            if (!chartData) return null;

            const total = chartData.reduce((sum, entry) => sum + entry.value, 0);
            if (total === 0) return null;

            const yesData = chartData.find(item => item.name === 'Yes');
            const noData = chartData.find(item => item.name === 'No');

            return (
              <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '5px', border: '1px solid #ccc' }}>
                <p>{`Yes: ${yesData ? ((yesData.value / total) * 100).toFixed(0) : 0}%`}</p>
                <p>{`No: ${noData ? ((noData.value / total) * 100).toFixed(0) : 0}%`}</p>
              </div>
            );
          }
          return null;
        }}
      />
    )}
  </PieChart>
);

const QuestionMatrix = ({ analysisData = [] }) => {
  // Calculate total responses (sum of yes and no for all questions)
  const totalResponses = analysisData.reduce((sum, question) => sum + (question.yes || 0) + (question.no || 0), 0);

  return (
    <div className="p-4 overflow-x-auto">
      {/* Top Header Row: Total Responses and Ride Numbers */}
      <div className="grid grid-cols-[300px_repeat(8,80px)] gap-12 items-center mb-1">
        <div className="font-bold text-lg text-black">Total Responses</div>
        <div className="text-center font-bold text-lg text-black">
          {/* Display total responses if data is available */}
          {analysisData.length > 0 ? totalResponses : "-"}
        </div>
        {Array.from({ length: 7 }).map((_, idx) => (
           <div key={idx + 1} className="text-center font-bold text-lg text-black">
             0{/* Display 0 for disabled rides */}
           </div>
         ))}
      </div>

      <div className="grid grid-cols-[300px_repeat(8,80px)] gap-12 items-center mb-3">
        <div className="font-semibold">Questions</div>
        {[
          "ALL RIDES",
          "Ride1",
          "Ride2",
          "Ride3",
          "Ride4",
          "Ride5",
          "Ride6",
          "Ride7",
        ].map((label, idx) => (
          <div key={idx} className="text-center font-semibold">
            {label}
          </div>
        ))}
      </div>

        {questions.map((q, qIdx) => {
          const questionData = analysisData.find((item) => item.q === q);
          const chartData = questionData
            ? [
              { name: "Yes", value: questionData.yes || 0 },
              { name: "No", value: questionData.no || 0 },
              ]
            : [
                { name: "Yes", value: 0 },
                { name: "No", value: 0 },
              ];

          return (
          <div
            key={qIdx}
            className="grid grid-cols-[300px_repeat(8,80px)] gap-12 items-center mb-6"
          >
              <div className="text-sm">{q}</div>
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="flex justify-center">
                <DonutChart data={chartData} isActive={idx === 0} />
                </div>
              ))}
          </div>
          );
        })}
    </div>
  );
};

export default QuestionMatrix;


