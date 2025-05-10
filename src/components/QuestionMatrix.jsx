import React from "react";

const questions = [
  "Rider & pillion wear helmet (2W)",
  "Car: seat belt worn",
  "Excessive honking",
  "Follow traffic signal",
  "Stop at stop line (red signal)",
  "Use cell phone while riding/driving",
  "Frequently changed lanes"
];

const rides = ["ALL RIDES", "Ride1", "Ride2", "Ride3", "Ride4", "Ride5", "Ride6", "Ride7"];

const QuestionMatrix = () => (
  <div className="flex gap-4 mt-6">
    {/* Questions */}
    <div>
      <div className="font-semibold mb-2">Questions</div>
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="whitespace-nowrap">{q}</div>
        ))}
      </div>
    </div>
    {/* Matrix */}
    <div className="flex-1 overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-x-4">
        <thead>
          <tr>
            {rides.map((ride, idx) => (
              <th key={idx} className="text-center font-semibold">{ride}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {questions.map((_, qIdx) => (
            <tr key={qIdx}>
              {rides.map((_, rIdx) => (
                <td key={rIdx} className="py-2 text-center">
                  <span className="inline-block w-5 h-5 border-2 border-black rounded-full"></span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default QuestionMatrix; 