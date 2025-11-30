'use client';
import React from 'react';

const RegexQuantifiersBasic = () => {
  // Section: Quantifiers (n+, n*, n?)
  const mails = "o @nn.sa osama@gmail.com elzero@gmail.net osama@mail.ru"; // All Emails
  const mailsRe = /\w+@\w+\.\w+/ig;
  const mailsMatch = mails.match(mailsRe);

  const numsQuantifiers = "0110 10 150 05120 0560 350 00"; // 0 Numbers Or No 0
  const numsReQuantifiers = /0\d*0/ig;
  const numsMatchQuantifiers = numsQuantifiers.match(numsReQuantifiers);

  const urlsQuantifiers = "https://google.com http://www.website.net web.com"; // http + https
  const urlsReQuantifiers = /(https?:\/\/)?(www\.)?\w+\.\w+/ig;
  const urlsMatchQuantifiers = urlsQuantifiers.match(urlsReQuantifiers);

  return (
    <div className="mb-8 p-4 themed-card">
      <h3 className="text-xl font-semibold text-primary mb-3">6. Quantifiers (<code>+</code>, <code>*</code>, <code>?</code>)</h3>
      <p className="mb-2 text-foreground"><strong>String (Emails):</strong> "{mails}"</p>
      <p className="text-foreground"><strong>Regex (Emails):</strong> <code className="bg-muted p-1 rounded">/\w+@\w+\.\w+/ig</code></p>
      <p className="mb-4 text-foreground"><strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(mailsMatch)}</code></p>

      <p className="mb-2 text-foreground"><strong>String (Numbers with 0):</strong> "{numsQuantifiers}"</p>
      <p className="text-foreground"><strong>Regex (<code className="bg-muted p-1 rounded">0\d*0</code>):</strong> <code className="bg-muted p-1 rounded">/0\d*0/ig</code></p>
      <p className="mb-4 text-foreground"><strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(numsMatchQuantifiers)}</code></p>

      <p className="mb-2 text-foreground"><strong>String (URLs):</strong> "{urlsQuantifiers}"</p>
      <p className="text-foreground"><strong>Regex (URLs):</strong> <code className="bg-muted p-1 rounded">/(https?:\/\/)?(www\.)?\w+\.\w+/ig</code></p>
      <p className="mb-4 text-foreground"><strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(urlsMatchQuantifiers)}</code></p>
    </div>
  );
};

export default RegexQuantifiersBasic;
