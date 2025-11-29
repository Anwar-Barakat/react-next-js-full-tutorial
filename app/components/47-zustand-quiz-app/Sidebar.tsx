import React from "react";
import { useQuizStore } from "./store";

const Sidebar = () => {
  const { questions, currentQuestion, answers } = useQuizStore();

  return (
    <div className="w-1/4 bg-card/50 text-foreground p-8 flex flex-col">
      <h3 className="text-xl font-bold mb-4 text-foreground">Quiz Progress</h3>
      <div className="space-y-2">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`p-2 rounded flex items-center justify-between ${
              index === currentQuestion ? "bg-primary/50" : "bg-muted/50"
            }`}
          >
            <span>Question {index + 1}</span>
            {answers[index] !== null ? (
              <span className="text-green-400">✅</span>
            ) : (
              <span className="text-muted-foreground">➖</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;