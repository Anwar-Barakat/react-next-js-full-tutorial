"use client";

import React from "react";
import { useQuizStore } from "./store";
import Sidebar from "./Sidebar";

const QuizApp = () => {
  const {
    questions,
    selectAnswer,
    answers,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    showScore,
    score,
    resetQuiz,
  } = useQuizStore();

  const question = questions[currentQuestion];
  const currentAnswer = answers[currentQuestion];

  const handleSelect = (optionIndex: number) => {
    selectAnswer(optionIndex);
  };

  if (showScore) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <h1 className="text-2xl font-semibold mb-4">Quiz Completed 🎉</h1>
        <p className="text-lg mb-4">
          Your score: <strong>{score}</strong> / {questions.length}
        </p>
        <button
          onClick={resetQuiz}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex flex-col w-3/4 p-8">
        <h2 className="text-xl font-bold mb-4">
          Question {currentQuestion + 1} of {questions.length}
        </h2>
        <p className="text-lg mb-4">{question.question}</p>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <label
              key={index}
              htmlFor={`option-${index}`}
              className={`block p-3 border rounded cursor-pointer ${
                currentAnswer === index
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-100"
              }`}
            >
              <input
                type="radio"
                id={`option-${index}`}
                name="answer"
                checked={currentAnswer === index}
                onChange={() => handleSelect(index)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={nextQuestion}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizApp;