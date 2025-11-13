'use client';

import React, { useState } from 'react';

const buttonClasses = "w-16 h-16 text-2xl m-1 rounded-xl border border-[var(--border)] cursor-pointer bg-gradient-to-br from-[var(--muted)] to-[var(--muted)]/80 text-[var(--foreground)] hover:bg-[var(--muted)]/90 hover:shadow-[var(--shadow-md)] hover:scale-105 active:scale-95 transition-all duration-200 font-semibold";
const operatorButtonClasses = "bg-gradient-to-br from-[var(--accent)] to-[var(--accent)]/90 text-white hover:shadow-[var(--shadow-md)] hover:scale-105 active:scale-95";
const clearButtonClasses = "bg-gradient-to-br from-[var(--secondary)] to-[var(--secondary)]/90 text-white hover:shadow-[var(--shadow-md)] hover:scale-105 active:scale-95";
const equalButtonClasses = "bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white hover:shadow-[var(--shadow-lg)] hover:scale-105 active:scale-95";

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
    <div className="center-content py-12 px-4 bg-gradient-to-br from-[var(--background)] via-[var(--muted)]/20 to-[var(--background)]">
      <div className="border-2 border-[var(--border)] rounded-2xl p-6 bg-gradient-to-br from-[var(--card)] to-[var(--muted)]/30 shadow-[var(--shadow-lg)] backdrop-blur-sm">
        <div className="w-full h-20 bg-gradient-to-br from-[var(--muted)] to-[var(--muted)]/80 text-[var(--foreground)] text-right p-4 text-4xl md:text-5xl font-bold mb-4 rounded-xl border-2 border-[var(--border)] shadow-[var(--shadow-sm)] box-border overflow-hidden">
          <span className="inline-block animate-in fade-in duration-200">{display}</span>
        </div>
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
