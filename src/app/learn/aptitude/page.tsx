import React from 'react';
import '@/css/DocPage.css'; // Reuse the documentation page styles for consistency

const Aptitude = () => {
  return (
    <div className="doc-container">
      <h1 className="doc-title">Mastering Aptitude Skills</h1>

      <p className="doc-paragraph">
        Aptitude tests are a crucial part of most job interviews. They are designed to evaluate your problem-solving skills, logical reasoning, and ability to think on your feet. This guide covers the essential topics to help you prepare effectively.
      </p>

      {/* Section 1: Quantitative Aptitude */}
      <h2 className="doc-subtitle">1. Quantitative Aptitude</h2>
      <p className="doc-paragraph">
        This section tests your numerical ability and mathematical skills. Speed and accuracy are key. Focus on understanding the core concepts and learning shortcuts.
      </p>
      <ul className="doc-list">
        <li><b>Number System:</b> HCF, LCM, divisibility rules, and unit digits.</li>
        <li><b>Percentages, Profit & Loss:</b> Core of arithmetic; used in many other topics.</li>
        <li><b>Time, Speed & Distance:</b> Problems on trains, boats, and streams.</li>
        <li><b>Time & Work:</b> Problems involving pipes, cisterns, and work efficiency.</li>
        <li><b>Simple & Compound Interest:</b> Understanding the formulas and their applications.</li>
        <li><b>Averages, Ratios & Proportions:</b> Fundamental concepts for data interpretation.</li>
      </ul>

      {/* Section 2: Logical Reasoning */}
      <h2 className="doc-subtitle">2. Logical Reasoning</h2>
      <p className="doc-paragraph">
        This section evaluates your ability to analyze information, identify patterns, and draw logical conclusions. No complex formulas are needed, just pure logic.
      </p>
      <ul className="doc-list">
        <li><b>Series Completion:</b> Finding the next number or letter in a sequence.</li>
        <li><b>Coding & Decoding:</b> Deciphering patterns in coded messages.</li>
        <li><b>Blood Relations:</b> Solving problems based on family tree structures.</li>
        <li><b>Direction Sense:</b> Tracking movement and finding positions based on directions.</li>
        <li><b>Seating Arrangements:</b> Arranging people in linear or circular patterns based on given conditions.</li>
        <li><b>Syllogisms:</b> Drawing conclusions from a set of given statements.</li>
      </ul>

      {/* Section 3: Verbal Ability */}
      <h2 className="doc-subtitle">3. Verbal Ability</h2>
      <p className="doc-paragraph">
        This section tests your grasp of the English language, including grammar, vocabulary, and reading comprehension.
      </p>
      <ul className="doc-list">
        <li><b>Synonyms & Antonyms:</b> Building a strong vocabulary is essential.</li>
        <li><b>Sentence Correction:</b> Identifying and correcting grammatical errors.</li>
        <li><b>Reading Comprehension:</b> Reading passages and answering questions based on them.</li>
        <li><b>Para Jumbles:</b> Arranging jumbled sentences to form a coherent paragraph.</li>
      </ul>

      {/* Section 4: Tips for Success */}
      <h2 className="doc-subtitle">Tips for Success</h2>
      <ul className="doc-list">
        <li><b>Practice Consistently:</b> Regular practice is the only way to improve speed and accuracy.</li>
        <li><b>Time Management:</b> Learn to solve questions quickly and don't get stuck on one problem for too long.</li>
        <li><b>Learn Formulas & Shortcuts:</b> Especially for Quantitative Aptitude, knowing shortcuts can save a lot of time.</li>
        <li><b>Take Mock Tests:</b> Simulate an exam environment to get used to the pressure and time constraints.</li>
      </ul>
    </div>
  );
};

export default Aptitude;