'use client';
import React from 'react';

const RegexCharacterClasses = () => {
  // Section: Character Classes (. , \w, \W, \d, \D, \s, \S)
  const emailCharClass = 'O @@@g...com O @g.com O @g.net A @Y.com O-g.com o @s.org 1 @1.com';
  const dot = /./g;
  const word = /\w/g;
  const valid = /\w+@\w+\.(com|net)/g;

  return (
    <div className="mb-8 p-4 themed-card">
      <h3 className="text-xl font-semibold text-primary mb-3">4. Character Classes (<code>.</code>, <code>\w</code>, <code>\W</code>, <code>\d</code>, <code>\D</code>, <code>\s</code>, <code>\S</code>)</h3>
      <p className="mb-2 text-foreground"><strong>String (Emails):</strong> "{emailCharClass}"</p>
      <ul className="list-disc pl-5 text-foreground">
        <li className="mb-1"><strong>Regex (.):</strong> <code className="bg-muted p-1 rounded">/./g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(emailCharClass.match(dot))}</code></li>
        <li className="mb-1"><strong>Regex (\w):</strong> <code className="bg-muted p-1 rounded">/\w/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(emailCharClass.match(word))}</code></li>
        <li className="mb-1"><strong>Regex (Valid Emails):</strong> <code className="bg-muted p-1 rounded">/\w+@\w+\.(com|net)/g</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(emailCharClass.match(valid))}</code></li>
      </ul>
    </div>
  );
};

export default RegexCharacterClasses;
