'use client';

import React, { useState } from 'react';

const buttonStyles = {
  width: '60px',
  height: '60px',
  fontSize: '1.5rem',
  margin: '5px',
  borderRadius: '8px',
  border: '1px solid #555',
  cursor: 'pointer',
  backgroundColor: '#444',
  color: '#eee',
};

const displayStyles = {
  width: '270px',
  height: '60px',
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'right' as const,
  padding: '10px',
  fontSize: '2rem',
  marginBottom: '10px',
  borderRadius: '8px',
  border: '1px solid #555',
  boxSizing: 'border-box' as const,
};

const calculatorStyles = {
  border: '1px solid #555',
  borderRadius: '10px',
  padding: '20px',
  display: 'inline-block',
  backgroundColor: '#222',
};

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

  const renderButton = (value: string, onClick: () => void, extraStyles = {}) => (
    <button style={{ ...buttonStyles, ...extraStyles }} onClick={onClick}>
      {value}
    </button>
  );

  return (
    <div style={calculatorStyles}>
      <div style={displayStyles}>{display}</div>
      <div>
        {renderButton('7', () => handleNumberClick('7'))}
        {renderButton('8', () => handleNumberClick('8'))}
        {renderButton('9', () => handleNumberClick('9'))}
        {renderButton('/', () => handleOperatorClick('/'), { backgroundColor: '#e69a00' })}
      </div>
      <div>
        {renderButton('4', () => handleNumberClick('4'))}
        {renderButton('5', () => handleNumberClick('5'))}
        {renderButton('6', () => handleNumberClick('6'))}
        {renderButton('*', () => handleOperatorClick('*'), { backgroundColor: '#e69a00' })}
      </div>
      <div>
        {renderButton('1', () => handleNumberClick('1'))}
        {renderButton('2', () => handleNumberClick('2'))}
        {renderButton('3', () => handleNumberClick('3'))}
        {renderButton('-', () => handleOperatorClick('-'), { backgroundColor: '#e69a00' })}
      </div>
      <div>
        {renderButton('0', () => handleNumberClick('0'))}
        {renderButton('C', handleClearClick, { backgroundColor: '#c9302c' })}
        {renderButton('=', handleEqualClick, { backgroundColor: '#449d44' })}
        {renderButton('+', () => handleOperatorClick('+'), { backgroundColor: '#e69a00' })}
      </div>
    </div>
  );
};
