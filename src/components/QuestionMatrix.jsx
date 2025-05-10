import React from "react";

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
