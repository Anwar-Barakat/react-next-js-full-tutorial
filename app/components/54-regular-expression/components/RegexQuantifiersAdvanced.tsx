'use client';
import React from 'react';

const RegexQuantifiersAdvanced = () => {
  // Section: Quantifiers ({x}, {x,y}, {x,})
  const serials = "S100S S3000S S50000S S950000S";
  const serialsMatch1 = serials.match(/s\d{3}s/ig); // S[Three Number]S
  const serialsMatch2 = serials.match(/s\d{4,5}s/ig); // S[Four Or Five Number]S
  const serialsMatch3 = serials.match(/s\d{4,}s/ig); // S[At Least Four]S

  return (
    <div className="mb-8 p-4 themed-card">
      <h3 className="text-xl font-semibold text-primary mb-3">7. Quantifiers (<code>{'{x}'}</code>, <code>{'{x,y}'}</code>, <code>{'{x,}'}</code>)</h3>
      <p className="mb-2 text-foreground"><strong>String (Serials):</strong> "{serials}"</p>
      <ul className="list-disc pl-5 text-foreground">
        <li className="mb-1"><strong>Regex (<code>{'s\\d{3}s'}</code> - three digits):</strong> <code className="bg-muted p-1 rounded">{'/s\\d{3}s/ig'}</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(serialsMatch1)}</code></li>
        <li className="mb-1"><strong>Regex (<code>{'s\\d{4,5}s'}</code> - four or five digits):</strong> <code className="bg-muted p-1 rounded">{'/s\\d{4,5}s/ig'}</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(serialsMatch2)}</code></li>
        <li className="mb-1"><strong>Regex (<code>{'s\\d{4,}s'}</code> - at least four digits):</strong> <code className="bg-muted p-1 rounded">{'/s\\d{4,}s/ig'}</code> <br /> <strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(serialsMatch3)}</code></li>
      </ul>
    </div>
  );
};

export default RegexQuantifiersAdvanced;