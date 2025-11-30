'use client';
import React from 'react';

const RegexBoundaryAndTest = () => {
  // Section: Character Classes (\b, \B) & Test Method
  const names = "Sayed 1Spam 2Spam 3Spam Spam4 Spam5 Osama Ahmed Aspamo";
  const reB = /(\bspam|spam\b)/ig;
  const namesMatchB = names.match(reB);
  const test1 = reB.test(names);
  const test2 = /(\bspam|spam\b)/ig.test("Osama");
  const test3 = /(\bspam|spam\b)/ig.test("1Spam");
  const test4 = /(\bspam|spam\b)/ig.test("Spam1");

  return (
    <div className="mb-8 p-4 themed-card">
      <h3 className="text-xl font-semibold text-primary mb-3">5. Character Classes (<code>\b</code>, <code>\B</code>) & Test Method</h3>
      <p className="mb-2 text-foreground"><strong>String:</strong> "{names}"</p>
      <p className="mb-2 text-foreground"><strong>Regex:</strong> <code className="bg-muted p-1 rounded">/(\bspam|spam\b)/ig</code></p>
      <p className="mb-4 text-foreground"><strong>Match Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(namesMatchB)}</code></p>

      <h4 className="text-lg font-medium text-primary mt-4 mb-2"><code>test()</code> Method Examples:</h4>
      <ul className="list-disc pl-5 text-foreground">
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">/(\bspam|spam\b)/ig.test("{names}")</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(test1)}</code></li>
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">/(\bspam|spam\b)/ig.test("Osama")</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(test2)}</code></li>
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">/(\bspam|spam\b)/ig.test("1Spam")</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(test3)}</code></li>
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">/(\bspam|spam\b)/ig.test("Spam1")</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(test4)}</code></li>
      </ul>
    </div>
  );
};

export default RegexBoundaryAndTest;
