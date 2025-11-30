'use client';
import React from 'react';

const RegexSyntaxExamples = () => {
  // Regex Lecture Content provided by the user, adapted for React display

  // Section: Regular Expression (Email, IP, Phone, URL) - Initial Examples
  const str1 = '10 20 100 1000 5000';
  const str2 = 'Os1 Os12 Os123 Os123Os Os12312Os123';
  const invalidEmail = 'Osama @@@gmail....com';
  const validEmail = 'o @nn.sa';
  const ip = '192.168.2.1'; // IPv4
  const urls = [
    'elzero.org',
    'elzero.org/',
    'http://elzero.org/',
    'http://www.elzero.org/',
    'https://.elzero.org/',
    'https://www.elzero.org/',
    'https://www.elzero.org/?facebookid=asdasdasd'
  ];

  // Section: Syntax, Modifiers, and Search Methods (match)
  const myString = "Hello Elzero Web School I Love elzero";
  const regex = /elzero/ig;
  const matchResult = myString.match(regex);

  return (
    <div className="mb-8 p-4 themed-card">
      <h3 className="text-xl font-semibold text-primary mb-3">1. Initial Examples & Syntax</h3>
      <p className="mb-2 text-foreground"><strong>Syntax:</strong> <code className="bg-muted p-1 rounded">/pattern/modifier(s);</code> or <code className="bg-muted p-1 rounded">new RegExp("pattern", "modifier(s)")</code></p>
      <p className="mb-2 text-foreground"><strong>Modifiers:</strong> <code className="bg-muted p-1 rounded">i</code> (case-insensitive), <code className="bg-muted p-1 rounded">g</code> (global), <code className="bg-muted p-1 rounded">m</code> (Multilines)</p>
      <p className="mb-2 text-foreground"><strong>Search Method:</strong> <code className="bg-muted p-1 rounded">match(Pattern)</code></p>

      <h4 className="text-lg font-medium text-primary mt-4 mb-2">Example: Basic Match</h4>
      <p className="text-foreground"><strong>String:</strong> "{myString}"</p>
      <p className="text-foreground"><strong>Regex:</strong> <code className="bg-muted p-1 rounded">/elzero/ig</code></p>
      <p className="text-foreground"><strong>Result:</strong> <code className="bg-muted p-1 rounded">{JSON.stringify(matchResult)}</code></p>
      
      {/* Displaying some of the initial variables for context */}
      <h4 className="text-lg font-medium text-primary mt-4 mb-2">Initial Data Examples:</h4>
      <p className="text-foreground"><strong>str1:</strong> "{str1}"</p>
      <p className="text-foreground"><strong>str2:</strong> "{str2}"</p>
      <p className="text-foreground"><strong>invalidEmail:</strong> "{invalidEmail}"</p>
      <p className="text-foreground"><strong>validEmail:</strong> "{validEmail}"</p>
      <p className="text-foreground"><strong>ip:</strong> "{ip}"</p>
      <p className="text-foreground"><strong>URLs:</strong> {urls.map((u, i) => <span key={i}>"{u}" </span>)}</p>

    </div>
  );
};

export default RegexSyntaxExamples;
