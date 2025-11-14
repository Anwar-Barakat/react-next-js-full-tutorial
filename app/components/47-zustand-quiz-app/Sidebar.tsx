import React from "react";
import { useQuizStore } from "./store";

const Sidebar = () => {
  const { questions, currentQuestion, answers } = useQuizStore();

  return (
    <div className="w-1/4 bg-gray-800 text-white p-8 flex flex-col">
      <h3 className="text-xl font-bold mb-4">Quiz Progress</h3>
      <div className="space-y-2">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`p-2 rounded flex items-center justify-between ${
              index === currentQuestion ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            <span>Question {index + 1}</span>
            {answers[index] !== null ? (
              <span className="text-green-400">✅</span>
            ) : (
              <span className="text-gray-400">➖</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;