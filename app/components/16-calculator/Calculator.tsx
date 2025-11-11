'use client';

import React, { useState } from 'react';

const buttonClasses = "w-16 h-16 text-2xl m-1 rounded-lg border border-gray-600 cursor-pointer bg-gray-700 text-gray-200";
const operatorButtonClasses = "bg-yellow-600";
const clearButtonClasses = "bg-red-700";
const equalButtonClasses = "bg-green-700";

export const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [operator, setOperator] = useState<string | null>(null);
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleNumberClick = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperatorClick = (op: string) => {
    if (prevValue && operator && !waitingForOperand) {
      const result = calculate();
      setDisplay(result);
      setPrevValue(result);
    } else {
      setPrevValue(display);
    }
    setOperator(op);
    setWaitingForOperand(true);
  };

  const calculate = () => {
    if (!operator || prevValue === null) return display;

    const current = parseFloat(display);
    const previous = parseFloat(prevValue);

    let result;
    switch (operator) {
      case '+':
        result = previous + current;
        break;
      case '-':
        result = previous - current;
        break;
      case '*':
        result = previous * current;
        break;
      case '/':
        result = previous / current;
        break;
      default:
        return display;
    }
    return result.toString();
  };

  const handleEqualClick = () => {
    if (!operator || prevValue === null) return;
    const result = calculate();
    setDisplay(result);
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(true);
  };

  const handleClearClick = () => {
    setDisplay('0');
    setOperator(null);
    setPrevValue(null);
    setWaitingForOperand(false);
  };

  const renderButton = (value: string, onClick: () => void, extraClasses = "") => (
    <button className={`${buttonClasses} ${extraClasses}`} onClick={onClick}>
      {value}
    </button>
  );

  return (
    <div className="border border-gray-600 rounded-lg p-5 inline-block bg-gray-800">
      <div className="w-full h-16 bg-gray-900 text-white text-right p-2.5 text-4xl mb-2.5 rounded-lg border border-gray-600 box-border">{display}</div>
      <div>
        {renderButton('7', () => handleNumberClick('7'))}
        {renderButton('8', () => handleNumberClick('8'))}
        {renderButton('9', () => handleNumberClick('9'))}
        {renderButton('/', () => handleOperatorClick('/'), operatorButtonClasses)}
      </div>
      <div>
        {renderButton('4', () => handleNumberClick('4'))}
        {renderButton('5', () => handleNumberClick('5'))}
        {renderButton('6', () => handleNumberClick('6'))}
        {renderButton('*', () => handleOperatorClick('*'), operatorButtonClasses)}
      </div>
      <div>
        {renderButton('1', () => handleNumberClick('1'))}
        {renderButton('2', () => handleNumberClick('2'))}
        {renderButton('3', () => handleNumberClick('3'))}
        {renderButton('-', () => handleOperatorClick('-'), operatorButtonClasses)}
      </div>
      <div>
        {renderButton('0', () => handleNumberClick('0'))}
        {renderButton('C', handleClearClick, clearButtonClasses)}
        {renderButton('=', handleEqualClick, equalButtonClasses)}
        {renderButton('+', () => handleOperatorClick('+'), operatorButtonClasses)}
      </div>
    </div>
  );
};
