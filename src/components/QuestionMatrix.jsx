// import React from "react";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";

// const questions = [
//   "If on Two wheeler did the rider and pillion wear helmet",
//   "If in car did driver and passangers wear seat belt",
//   "Did rider / driver do excessive Honking",
//   "Did rider / driver follow traffic singal",
//   "During red signal did rider / driver follow stop with stop line",
//   "Did rider / driver use cell phone while riding/driving",
//   "Did rider / driver frequently changed lanes",
//   "Did rider / driver drive in no entry",
//   "Did they give way to pedestrians",
//   "If in auto did they over load the auto",
//   "If you were on two wheeler did you triple ride",
//   "Did your rider/driver have driving licence and insurrance",
// ];

// const COLORS_ACTIVE = ["#4339F2", "#F2B705"]; // Blue for Yes, Yellow for No
// const COLORS_INACTIVE = ["#A0A0A0", "#D0D0D0"]; // Gray shades for inactive

// const DonutChart = ({ data, isActive }) => (
//   <PieChart width={50} height={50}>
//     <Pie
//       data={data}
//       cx="50%"
//       cy="50%"
//       innerRadius={12}
//       outerRadius={20}
//       startAngle={180}
//       endAngle={-180}
//       dataKey="value"
//       stroke="none"
//       className={isActive ? "" : "opacity-50"}
//     >
//       {data.map((entry, index) => (
//         <Cell
//           key={cell-${index}}
//           fill={isActive ? COLORS_ACTIVE[index] : COLORS_INACTIVE[index]}
//         />
//       ))}
//     </Pie>
//     <Tooltip formatter={(value, name) => [${value}%, name]} />
//   </PieChart>
// );

// const QuestionMatrix = ({ analysisData = [] }) => {
//   return (
//     <div className="p-4 overflow-x-auto">
//       <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
//         {/* Left Column - Questions */}
//         <div>
//           <div className="font-semibold mb-3">Questions</div>
//           <div className="space-y-14">
//             {questions.map((q, idx) => (
//               <div key={idx} className="whitespace-nowrap text-sm">
//                 {q}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Right Column - Chart Matrix */}
//         <div className="overflow-x-auto">
//           <div className="min-w-max">
//             {/* Ride Labels */}
//             <div className="grid grid-cols-1 gap-6 text-center font-semibold mb-3">
//               <div>ALL RIDES</div>
//             </div>

//             {/* Donut Charts for each question */}
//             <div className="space-y-6">
//               {questions.map((q, qIdx) => {
//                 const questionData = Array.isArray(analysisData)
//                   ? analysisData.find((item) => item.q === q)
//                   : null;

//                 const chartData = questionData
//                   ? [
//                       { name: "Yes", value: questionData.yes },
//                       { name: "No", value: questionData.no },
//                     ]
//                   : [
//                       { name: "Yes", value: 0 },
//                       { name: "No", value: 0 },
//                     ];

//                 return (
//                   <div
//                     key={qIdx}
//                     className="grid grid-cols-1 gap-6 items-center"
//                   >
//                     <div className="flex justify-center">
//                       <DonutChart data={chartData} isActive={!!questionData} />
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuestionMatrix;

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

const COLORS_ACTIVE = ["#4339F2", "#F2B705"]; // Blue for Yes, Yellow for No
const COLORS_INACTIVE = ["#A0A0A0", "#D0D0D0"]; // Gray shades for inactive

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
      <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
        {/* Left Column - Questions */}
        <div>
          <div className="font-semibold mb-3">Questions</div>
          <div className="space-y-14">
            {questions.map((q, idx) => (
              <div key={idx} className="whitespace-nowrap text-sm">
                {q}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Chart Matrix */}
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Ride Labels */}
            <div className="grid grid-cols-1 gap-6 text-center font-semibold mb-3">
              <div>ALL RIDES</div>
            </div>

            {/* Donut Charts for each question */}
            <div className="space-y-6">
              {questions.map((q, qIdx) => {
                const questionData = Array.isArray(analysisData)
                  ? analysisData.find((item) => item.q === q)
                  : null;

                const chartData = questionData
                  ? [
                      { name: "Yes", value: questionData.yes },
                      { name: "No", value: questionData.no },
                    ]
                  : [
                      { name: "Yes", value: 0 },
                      { name: "No", value: 0 },
                    ];

                return (
                  <div
                    key={qIdx}
                    className="grid grid-cols-1 gap-6 items-center"
                  >
                    <div className="flex justify-center">
                      <DonutChart data={chartData} isActive={!!questionData} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionMatrix;
