'use client';
import React from 'react';

const RegexReplaceMethods = () => {
  // Section: replace and replaceAll
  let txt = "We Love Programming And @ Because @ Is Amazing";
  const txtReplace1 = txt.replace(" @", "JavaScript");
  const txtReplaceAll1 = txt.replaceAll(" @", "JavaScript");
  const reReplace = / @/ig;
  const txtReplaceAll2 = txt.replaceAll(reReplace, "JavaScript");
  const txtReplaceAll3 = txt.replaceAll(/ @/ig, "JavaScript");

  return (
    <div className="mb-8 p-4 themed-card">
      <h3 className="text-xl font-semibold text-primary mb-3">9. <code className="bg-muted p-1 rounded">replace</code> and <code className="bg-muted p-1 rounded">replaceAll</code> Methods</h3>
      <p className="mb-2 text-foreground"><strong>Original String:</strong> "{txt}"</p>
      <ul className="list-disc pl-5 text-foreground">
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">txt.replace(" @", "JavaScript")</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(txtReplace1)}</code></li>
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">txt.replaceAll(" @", "JavaScript")</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(txtReplaceAll1)}</code></li>
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">txt.replaceAll(re, "JavaScript")</code> where <code className="bg-muted p-1 rounded">re = / @/ig</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(txtReplaceAll2)}</code></li>
        <li className="mb-1"><strong><code className="bg-muted p-1 rounded">txt.replaceAll(/ @/ig, "JavaScript")</code>:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(txtReplaceAll3)}</code></li>
      </ul>
    </div>
  );
};

export default RegexReplaceMethods;
