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
    <Tooltip formatter={(value, name) => [`${value}%`, name]} />
  </PieChart>
);

const QuestionMatrix = ({ analysisData = [] }) => {
  return (
    <div className="p-4 overflow-x-auto">
      {/* Top Header Row: Total and Ride Numbers */}
      <div className="grid grid-cols-[300px_repeat(8,80px)] gap-12 items-center mb-1">
        <div className="font-bold text-lg text-black">Total  Responses</div>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((number, idx) => (
          <div key={idx} className="text-center font-bold text-lg text-black">
            {number}
          </div>
        ))}
      </div>

      {/* Header Row: Questions and Ride Labels */}
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

      {/* Data Rows: Question text and Donut Charts */}
      {questions.map((q, qIdx) => {
        const questionData = analysisData.find((item) => item.q === q);
        const chartData = questionData
          ? [
              { name: "Yes", value: questionData.yes },
              { name: "No", value: questionData.no },
            ]
          : [
              { name: "Yes", value: 0 },
              { name: "No", value: 0 },
            ];

        const areChartsActive = !!questionData;

        return (
          <div
            key={qIdx}
            className="grid grid-cols-[300px_repeat(8,80px)] gap-12 items-center"
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
