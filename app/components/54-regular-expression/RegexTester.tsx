'use client';
import React from 'react';
import RegexSyntaxExamples from './components/RegexSyntaxExamples';
import RegexRangesPart1 from './components/RegexRangesPart1';
import RegexRangesPart2 from './components/RegexRangesPart2';
import RegexCharacterClasses from './components/RegexCharacterClasses';
import RegexBoundaryAndTest from './components/RegexBoundaryAndTest';
import RegexQuantifiersBasic from './components/RegexQuantifiersBasic';
import RegexQuantifiersAdvanced from './components/RegexQuantifiersAdvanced';
import RegexAnchorsAndLookarounds from './components/RegexAnchorsAndLookarounds';
import RegexReplaceMethods from './components/RegexReplaceMethods';

const RegexTester = () => {
  return (
    <div className="">
      <RegexSyntaxExamples />
      <RegexRangesPart1 />
      <RegexRangesPart2 />
      <RegexCharacterClasses />
      <RegexBoundaryAndTest />
      <RegexQuantifiersBasic />
      <RegexQuantifiersAdvanced />
      <RegexAnchorsAndLookarounds />
      <RegexReplaceMethods />
    </div>
  );
};

export default RegexTester;