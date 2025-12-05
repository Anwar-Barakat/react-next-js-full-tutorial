import React, { useState } from 'react';

interface InputFormProps {
  onSubmit: (value: string) => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(inputValue);
    setInputValue(''); // Clear input after submit
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="input-field">Enter Text:</label>
      <input
        id="input-field"
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Type something..."
      />
      <button type="submit">Submit</button>
    </form>
  );
};
