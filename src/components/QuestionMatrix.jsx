
// import React from "react";
// import { PieChart, Pie, Cell, Tooltip } from "recharts";

// const questions = [
//   "If on a bike or scooter, did everyone wear a helmet?",
//   "If in a car, did everyone wear a seatbelt?",
//   "Did the driver honk too much?",
//   "Did the driver follow traffic lights?",
//   "At a red light, did the driver stop at the white line?",
//   "Did the driver use a phone while driving?",
//   "Did the driver keep changing lanes?",
//   'Did the driver go into a "No Entry" road?',
//   "Did the driver stop for people walking (pedestrians)?",
//   "If in an auto, were too many people sitting inside?",
//   "If on a two-wheeler, were three people riding on it?",
//   "Did your driver have a license and insurance?",
// ];

// const rides = ["ALL RIDES", "Ride1", "Ride2", "Ride3", "Ride4", "Ride5", "Ride6", "Ride7"];

// const generateRandomData = () => {
//   const yes = Math.floor(Math.random() * 60) + 20; // 20-80%
//   const no = 100 - yes;
//   return [
//     { name: "Yes", value: yes },
//     { name: "No", value: no },
//   ];
// };

// const COLORS = ["#4339F2", "#F2B705"]; // Blue for Yes, Yellow for No

// const DonutChart = ({ data }) => (
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
//     >
//       {data.map((entry, index) => (
//         <Cell key={`cell-${index}`} fill={COLORS[index]} />
//       ))}
//     </Pie>
//     <Tooltip formatter={(value, name) => [`${value}%`, name]} />
//   </PieChart>
// );

// const QuestionMatrix = () => (
//   <div className="p-4 overflow-x-auto">
//     <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
//       {/* Left Column - Questions */}
//       <div>
//         <div className="font-semibold mb-3">Questions</div>
//         <div className="space-y-14">
//           {questions.map((q, idx) => (
//             <div key={idx} className="whitespace-nowrap text-sm">{q}</div>
//           ))}
//         </div>
//       </div>

//       {/* Right Column - Chart Matrix */}
//       <div className="overflow-x-auto">
//         <div className="min-w-max">
//           {/* Ride Labels */}
//           <div className="grid grid-cols-8 gap-6 text-center font-semibold mb-3">
//             {rides.map((ride, idx) => (
//               <div key={idx}>{ride}</div>
//             ))}
//           </div>

//           {/* Donut Charts for each question */}
//           <div className="space-y-6">
//             {questions.map((_, qIdx) => (
//               <div key={qIdx} className="grid grid-cols-8 gap-6 items-center">
//                 {rides.map((_, rIdx) => (
//                   <div key={rIdx} className="flex justify-center">
//                     <DonutChart data={generateRandomData()} />
//                   </div>
//                 ))}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// export default QuestionMatrix;


import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

const questions = [
  "If on a bike or scooter, did everyone wear a helmet?",
  "If in a car, did everyone wear a seatbelt?",
  "Did the driver honk too much?",
  "Did the driver follow traffic lights?",
  "At a red light, did the driver stop at the white line?",
  "Did the driver use a phone while driving?",
  "Did the driver keep changing lanes?",
  'Did the driver go into a "No Entry" road?',
  "Did the driver stop for people walking (pedestrians)?",
  "If in an auto, were too many people sitting inside?",
  "If on a two-wheeler, were three people riding on it?",
  "Did your driver have a license and insurance?",
];

const rides = ["ALL RIDES", "Ride1", "Ride2", "Ride3", "Ride4", "Ride5", "Ride6", "Ride7"];

const generateRandomData = () => {
  const yes = Math.floor(Math.random() * 60) + 20; // 20-80%
  const no = 100 - yes;
  return [
    { name: "Yes", value: yes },
    { name: "No", value: no },
  ];
};

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
      className={isActive ? "" : "opacity-50"} // Reduce opacity for inactive
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

const QuestionMatrix = () => (
  <div className="p-4 overflow-x-auto">
    <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
      {/* Left Column - Questions */}
      <div>
        <div className="font-semibold mb-3">Questions</div>
        <div className="space-y-14">
          {questions.map((q, idx) => (
            <div key={idx} className="whitespace-nowrap text-sm">{q}</div>
          ))}
        </div>
      </div>

      {/* Right Column - Chart Matrix */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Ride Labels */}
          <div className="grid grid-cols-8 gap-6 text-center font-semibold mb-3">
            {rides.map((ride, idx) => (
              <div key={idx}>{ride}</div>
            ))}
          </div>

          {/* Donut Charts for each question */}
          <div className="space-y-6">
            {questions.map((_, qIdx) => (
              <div key={qIdx} className="grid grid-cols-8 gap-6 items-center">
                {rides.map((_, rIdx) => (
                  <div key={rIdx} className="flex justify-center">
                    <DonutChart
                      data={generateRandomData()}
                      isActive={rIdx === 0} // Active only for ALL RIDES (index 0)
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default QuestionMatrix;