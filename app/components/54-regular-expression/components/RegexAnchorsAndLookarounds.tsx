'use client';
import React from 'react';

const RegexAnchorsAndLookarounds = () => {
  // Section: Quantifiers ($, ^, ?=, ?!)
  const myStringAnchors = "We Love Programming";
  const namesAnchors = "1OsamaZ 2AhmedZ 3Mohammed 4MoustafaZ 5GamalZ";
  const testAnchors1 = /ing$/ig.test(myStringAnchors);
  const testAnchors2 = /^we/ig.test(myStringAnchors);
  const testAnchors3 = /lz$/ig.test(namesAnchors);
  const testAnchors4 = /^\d/ig.test(namesAnchors);
  const namesMatchAnchors1 = namesAnchors.match(/\d\w{5}(?=Z)/ig);
  const namesMatchAnchors2 = namesAnchors.match(/\d\w{8}(?!Z)/ig);

  return (
    <div className="mb-8 p-4 themed-card">
      <h3 className="text-xl font-semibold text-primary mb-3">8. Anchors (<code>^</code>, <code>$</code>) and Lookarounds (<code>?=</code>, <code>?!</code>)</h3>
      <p className="mb-2 text-foreground"><strong>String (Programming):</strong> "{myStringAnchors}"</p>
      <ul className="list-disc pl-5 mb-4 text-foreground">
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">{'/ing$/ig.test("'}{myStringAnchors}{'")'}</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(testAnchors1)}</code></li>
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">{'/^we/ig.test("'}{myStringAnchors}{'")'}</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(testAnchors2)}</code></li>
      </ul>

      <p className="mb-2 text-foreground"><strong>String (Names):</strong> "{namesAnchors}"</p>
      <ul className="list-disc pl-5 text-foreground">
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">{'/lz$/ig.test("'}{namesAnchors}{'")'}</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(testAnchors3)}</code></li>
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">{'/^\\d/ig.test("'}{namesAnchors}{'")'}</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(testAnchors4)}</code></li>
        <li className="mb-1"><strong>Regex (<code className="bg-muted p-1 rounded">{'\\d\\w{5}(?=Z)'}</code> - followed by Z):</strong> <code className="bg-muted p-1 rounded">{'/\\d\\w{5}(?=Z)/ig'}</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(namesMatchAnchors1)}</code></li>
        <li className="mb-1"><strong>Regex (<code className="bg-muted p-1 rounded">{'\\d\\w{8}(?!Z)'}</code> - NOT followed by Z):</strong> <code className="bg-muted p-1 rounded">{'/\\d\\w{8}(?!Z)/ig'}</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(namesMatchAnchors2)}</code></li>
      </ul>
    </div>
  );
};

export default RegexAnchorsAndLookarounds;
