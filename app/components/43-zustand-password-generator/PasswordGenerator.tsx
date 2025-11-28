'use client';
import React, { useEffect } from "react";
import { usePasswordStore } from "./store";

const PasswordGenerator = () => {
  const {
    length,
    includeNumbers,
    includeSymbols,
    includeUppercase,
    includeLowercase,
    generatedPassword,
    setLength,
    toggleNumbers,
    toggleSymbols,
    toggleUppercase,
    toggleLowercase,
    generatePassword,
  } = usePasswordStore();

  useEffect(() => {
    generatePassword();
  }, [length, includeNumbers, includeSymbols, includeUppercase, includeLowercase, generatePassword]);

  return (
    <div className="card flex flex-col items-center p-6">
      <h2 className="text-2xl font-bold text-card-foreground mb-4">Password Generator</h2>

      <div className="w-full max-w-md mb-6">
        <div className="bg-muted p-4 rounded-lg mb-4 flex justify-between items-center">
          <h1 className="text-xl text-card-foreground font-mono break-all">{generatedPassword}</h1>
          <button
            onClick={() => navigator.clipboard.writeText(generatedPassword)}
            className="btn btn-sm btn-accent ml-4"
          >
            Copy
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-card-foreground text-sm font-bold mb-2">
            Password length: {length}
          </label>
          <input
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(+e.target.value)}
            className="w-full h-2 bg-muted-foreground rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center text-card-foreground">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={toggleNumbers}
              className="mr-2 h-4 w-4 text-primary rounded focus:ring-primary"
            />
            Include numbers
          </label>
          <label className="flex items-center text-card-foreground">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={toggleSymbols}
              className="mr-2 h-4 w-4 text-primary rounded focus:ring-primary"
            />
            Include symbols
          </label>
          <label className="flex items-center text-card-foreground">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={toggleLowercase}
              className="mr-2 h-4 w-4 text-primary rounded focus:ring-primary"
            />
            Include lowercase
          </label>
          <label className="flex items-center text-card-foreground">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={toggleUppercase}
              className="mr-2 h-4 w-4 text-primary rounded focus:ring-primary"
            />
            Include uppercase
          </label>
        </div>

        <button onClick={generatePassword} className="btn btn-primary w-full mt-6">
          Generate Password
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;