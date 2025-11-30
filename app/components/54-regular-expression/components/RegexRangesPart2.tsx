'use client';
import React from 'react';

const RegexRangesPart2 = () => {
  // Section: Ranges - Part 2 ([a-z], [^a-z], [A-Z], [^A-Z], [abc], [^abc])
  const myStringRanges = "AaBbcdefG123!234%^&*";
  const atozSmall = /[a-z]/g;
  const NotAtozSmall = /[^a-z]/g;
  const atozCapital = /[A-Z]/g;
  const NotAtozCapital = /[^A-Z]/g;
  const aAndcAnde = /[ace]/g;
  const NotaAndcAnde = /[^ace]/g;
  const lettersCapsAndSmall = /[a-zA-Z]/g;
  const numsAndSpecials = /[^a-zA-Z]/g;
  const specials = /[^a-zA-Z0-9]/g;

  return (
    <div className="mb-8 p-4 themed-card">
      <h3 className="text-xl font-semibold text-primary mb-3">3. Ranges - Part 2 (<code>[a-z]</code>, <code>[A-Z]</code>, <code>[abc]</code>, etc.)</h3>
      <p className="mb-2 text-foreground"><strong>String:</strong> "{myStringRanges}"</p>
      <ul className="list-disc pl-5 text-foreground">
        <li className="mb-1"><strong>Regex ([a-z]):</strong> <code className="bg-muted p-1 rounded">/[a-z]/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(myStringRanges.match(atozSmall))}</code></li>
        <li className="mb-1"><strong>Regex ([^a-z]):</strong> <code className="bg-muted p-1 rounded">/[^a-z]/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(myStringRanges.match(NotAtozSmall))}</code></li>
        <li className="mb-1"><strong>Regex ([A-Z]):</strong> <code className="bg-muted p-1 rounded">/[A-Z]/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(myStringRanges.match(atozCapital))}</code></li>
        <li className="mb-1"><strong>Regex ([^A-Z]):</strong> <code className="bg-muted p-1 rounded">/[^A-Z]/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(myStringRanges.match(NotAtozCapital))}</code></li>
        <li className="mb-1"><strong>Regex ([ace]):</strong> <code className="bg-muted p-1 rounded">/[ace]/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(myStringRanges.match(aAndcAnde))}</code></li>
        <li className="mb-1"><strong>Regex ([^ace]):</strong> <code className="bg-muted p-1 rounded">/[^ace]/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(myStringRanges.match(NotaAndcAnde))}</code></li>
        <li className="mb-1"><strong>Regex ([a-zA-Z]):</strong> <code className="bg-muted p-1 rounded">/[a-zA-Z]/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(myStringRanges.match(lettersCapsAndSmall))}</code></li>
        <li className="mb-1"><strong>Regex ([^a-zA-Z]):</strong> <code className="bg-muted p-1 rounded">/[^a-zA-Z]/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(myStringRanges.match(numsAndSpecials))}</code></li>
        <li className="mb-1"><strong>Regex ([^a-zA-Z0-9]):</strong> <code>/[^a-zA-Z0-9]/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(myStringRanges.match(specials))}</code></li>
      </ul>
    </div>
  );
};

export default RegexRangesPart2;
