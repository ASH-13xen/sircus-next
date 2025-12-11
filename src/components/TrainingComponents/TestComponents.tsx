"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Timer, RotateCcw } from "lucide-react";

// --- 1. REUSABLE QUIZ ENGINE COMPONENT ---
// This handles the logic for ANY test so you don't repeat code.

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option (0-3)
}

interface QuizProps {
  title: string;
  questions: Question[];
}

function QuizEngine({ title, questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    // Save answer
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption !== null ? selectedOption : -1;
    setAnswers(newAnswers);

    // Update score if correct
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next or finish
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setAnswers(new Array(questions.length).fill(-1));
  };

  // --- RENDER RESULT CARD ---
  if (showResult) {
    const percentage = (score / questions.length) * 100;
    return (
      <Card className="max-w-2xl mx-auto bg-[#0b1021] border-slate-800 text-white">
        <CardContent className="p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
            {percentage >= 70 ? (
              <CheckCircle className="w-10 h-10 text-green-500" />
            ) : (
              <XCircle className="w-10 h-10 text-red-500" />
            )}
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-2">{title} Completed!</h2>
            <p className="text-slate-400">Here is your performance summary</p>
          </div>

          <div className="py-6 bg-slate-900/50 rounded-xl border border-slate-800">
            <span className="text-5xl font-bold text-blue-500">{score}</span>
            <span className="text-xl text-slate-500"> / {questions.length}</span>
            <p className="mt-2 text-sm text-slate-400 uppercase tracking-widest">Correct Answers</p>
          </div>

          <Button onClick={resetQuiz} className="w-full bg-slate-800 hover:bg-slate-700 text-white">
            <RotateCcw className="w-4 h-4 mr-2" /> Retake Test
          </Button>
        </CardContent>
      </Card>
    );
  }

  // --- RENDER QUESTION CARD ---
  return (
    <Card className="max-w-3xl mx-auto bg-[#0b1021] border-slate-800 text-white">
      <CardContent className="p-8">
        
        {/* Header: Progress & Title */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-bold text-blue-400 mb-1">{title}</h2>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-2 text-slate-400 bg-slate-900 px-3 py-1 rounded-full text-sm">
            <Timer className="w-4 h-4" />
            <span>Mock Mode</span>
          </div>
        </div>

        {/* Question Text */}
        <h3 className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
          {questions[currentQuestion].text}
        </h3>

        {/* Options Grid */}
        <div className="grid gap-4 mb-8">
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`
                w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3
                ${selectedOption === index 
                  ? "bg-blue-600/20 border-blue-500 text-white" 
                  : "bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700"}
              `}
            >
              <span className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs border
                ${selectedOption === index ? "bg-blue-500 border-blue-500 text-white" : "border-slate-600 text-slate-500"}
              `}>
                {String.fromCharCode(65 + index)}
              </span>
              {option}
            </button>
          ))}
        </div>

        {/* Footer: Navigation */}
        <div className="flex justify-end">
          <Button 
            onClick={handleNext} 
            disabled={selectedOption === null}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
          >
            {currentQuestion === questions.length - 1 ? "Finish Test" : "Next Question"}
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}

// --- 2. SPECIFIC SUBJECT WRAPPERS (Mock Data) ---

export const DSATest = () => {
  const questions: Question[] = [
    { id: 1, text: "Which data structure is LIFO (Last In First Out)?", options: ["Queue", "Stack", "Array", "Tree"], correctAnswer: 1 },
    { id: 2, text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"], correctAnswer: 1 },
    { id: 3, text: "Which sorting algorithm is generally the fastest in practice?", options: ["Bubble Sort", "Insertion Sort", "Quick Sort", "Selection Sort"], correctAnswer: 2 },
  ];
  return <QuizEngine title="DSA Assessment" questions={questions} />;
};

export const WebTest = () => {
  const questions: Question[] = [
    { id: 1, text: "What does DOM stand for?", options: ["Data Object Model", "Document Object Model", "Digital Ordinance Model", "Document Orientation Mode"], correctAnswer: 1 },
    { id: 2, text: "Which hook is used for side effects in React?", options: ["useState", "useContext", "useEffect", "useReducer"], correctAnswer: 2 },
    { id: 3, text: "What is the correct CSS syntax to select an ID?", options: [".id", "#id", "id", "*id"], correctAnswer: 1 },
  ];
  return <QuizEngine title="Web Development Quiz" questions={questions} />;
};

export const SecurityTest = () => {
  const questions: Question[] = [
    { id: 1, text: "What does XSS stand for?", options: ["Cross Site Scripting", "Extra Secure Socket", "XML System Security", "X-Ray Security System"], correctAnswer: 0 },
    { id: 2, text: "Which protocol is secure?", options: ["HTTP", "FTP", "Telnet", "HTTPS"], correctAnswer: 3 },
  ];
  return <QuizEngine title="Cyber Security Challenge" questions={questions} />;
};

export const AITest = () => {
  const questions: Question[] = [
    { id: 1, text: "Who is known as the father of AI?", options: ["Alan Turing", "Elon Musk", "John McCarthy", "Bill Gates"], correctAnswer: 2 },
    { id: 2, text: "Which language is most popular for ML?", options: ["Java", "Python", "C++", "Ruby"], correctAnswer: 1 },
  ];
  return <QuizEngine title="AI & ML Basics" questions={questions} />;
};

export const AptitudeTest = () => {
  const questions: Question[] = [
    { id: 1, text: "If 2x + 4 = 10, what is x?", options: ["2", "3", "4", "5"], correctAnswer: 1 },
    { id: 2, text: "Which number comes next: 2, 4, 8, 16...?", options: ["24", "32", "20", "48"], correctAnswer: 1 },
  ];
  return <QuizEngine title="General Aptitude" questions={questions} />;
};

// Placeholder for System Design (Coming Soon)
export const SystemTest = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
       <h2 className="text-2xl font-bold text-white mb-2">System Design</h2>
       <p>This module is currently under development.</p>
       <Button variant="outline" className="mt-4">Go Back</Button>
    </div>
  );
};