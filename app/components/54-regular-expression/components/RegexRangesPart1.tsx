'use client';
import React from 'react';

const RegexRangesPart1 = () => {
  // Section: Ranges - Part 1 (X|Y, [0-9], [^0-9])
  const tld = "Com Net Org Info Code Io";
  const tldRe = /(info|org|io)/ig;
  const tldMatch = tld.match(tldRe);

  const nums = "12345678910";
  const numsRe = /[0-2]/g;
  const numsMatch = nums.match(numsRe);

  const notNums = "12345678910";
  const notNsRe = /[^0-2]/g;
  const notNsMatch = notNums.match(notNsRe);

  const specialNums = "1!2 @3#4$5%678910";
  const specialNumsRe = /[^0-9]/g;
  const specialNumsMatch = specialNums.match(specialNumsRe);

  const practice = "Os1 Os1Os Os2 Os8 Os8Os";
  const practiceRe = /Os[5-9]Os/g;
  const practiceMatch = practice.match(practiceRe);

  return (
    <div className="mb-8 p-4 themed-card">
      <h3 className="text-xl font-semibold text-primary mb-3">2. Ranges - Part 1 (<code>(X|Y)</code>, <code>[0-9]</code>, <code>[^0-9]</code>)</h3>
      <p className="mb-2 text-foreground"><strong>String (TLD):</strong> "{tld}"</p>
      <p className="text-foreground"><strong>Regex (TLD):</strong> <code className="bg-muted p-1 rounded">/(info|org|io)/ig</code></p>
      <p className="mb-4 text-foreground"><strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(tldMatch)}</code></p>

      <p className="mb-2 text-foreground"><strong>String (Numbers):</strong> "{nums}"</p>
      <p className="text-foreground"><strong>Regex ([0-2]):</strong> <code className="bg-muted p-1 rounded">/[0-2]/g</code></p>
      <p className="mb-4 text-foreground"><strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(numsMatch)}</code></p>

      <p className="mb-2 text-foreground"><strong>String (Not Numbers):</strong> "{notNums}"</p>
      <p className="text-foreground"><strong>Regex ([^0-2]):</strong> <code className="bg-muted p-1 rounded">/[^0-2]/g</code></p>
      <p className="mb-4 text-foreground"><strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(notNsMatch)}</code></p>

      <p className="mb-2 text-foreground"><strong>String (Special Numbers):</strong> "{specialNums}"</p>
      <p className="text-foreground"><strong>Regex ([^0-9]):</strong> <code className="bg-muted p-1 rounded">/[^0-9]/g</code></p>
      <p className="mb-4 text-foreground"><strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(specialNumsMatch)}</code></p>

      <p className="mb-2 text-foreground"><strong>String (Practice):</strong> "{practice}"</p>
      <p className="text-foreground"><strong>Regex (Os[5-9]Os):</strong> <code className="bg-muted p-1 rounded">/Os[5-9]Os/g</code></p>
      <p className="mb-4 text-foreground"><strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(practiceMatch)}</code></p>
    </div>
  );
};

export default RegexRangesPart1;
