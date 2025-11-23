"use client";

import React from "react";
import "@/css/scrollbar.css";
import WebDevBar from "@/components/WebDevbar";

// 1. Define strict types
type TopicContentMap = {
  [key: string]: React.ReactNode;
};

const Jstopics: string[] = [
  // Welcome and Introduction
  "Welcome to Learn JavaScript!",
  "Introduction to JavaScript",
  // Variables and Core Concepts
  "Variables",
  "Comparison operators",
  "Control flow",
  // Data Types and Structures
  "Data types and structures",
  "Numbers",
  "Strings",
  "Booleans",
  "Null and undefined values",
  "BigInt",
  "Symbols",
  // Functions
  "Introduction to functions",
  "Function expressions",
  "The \"new\" keyword",
  "The \"return\" keyword",
  "The \"this\" keyword",
  // Objects and Prototypes
  "Introduction to objects",
  "Property accessors",
  "Prototypal inheritance",
  "Property descriptors",
  // Collections
  "Indexed collections",
  "Keyed collections",
  // Classes
  "Introduction to classes",
  "Extend classes",
  "Class fields and methods",
  "Static initialization blocks",
  // Wrap-up
  "Appendix"
];

const JstopicContent: TopicContentMap = {
  "Welcome to Learn JavaScript!": (
    <p>We're excited to have you on this journey to master JavaScript! This course covers everything from basic syntax to advanced object-oriented programming.</p>
  ),
  "Introduction to JavaScript": (
    <>
      <p className="mb-4">JavaScript is a versatile programming language primarily used for creating interactive and dynamic content on the web. It's the 'behavior' layer of the internet.</p>
      <p>It's essential for web development, enabling responsive user interfaces and powerful web applications on both the client (browser) and server (Node.js) sides.</p>
    </>
  ),
  "Variables": (
    <>
      <p className="mb-4">A <strong>variable</strong> is a named storage location for data. In JavaScript, you declare variables using <code>let</code>, <code>const</code>, or the older <code>var</code> keywords.</p>
      <p>Learning how to properly declare and scope variables is fundamental to writing reliable JavaScript code.</p>
    </>
  ),
  "Comparison operators": (
    <>
      <p className="mb-4"><strong>Comparison operators</strong> are used to compare two values and return a boolean result (<code>true</code> or <code>false</code>).</p>
      <p>It's crucial to understand the difference between the <strong>equality operator (<code>==</code>)</strong> and the <strong>strict equality operator (<code>===</code>)</strong> to avoid unexpected behavior.</p>
    </>
  ),
  "Control flow": (
    <>
      <p className="mb-4"><strong>Control flow</strong> structures determine the order in which statements are executed. The main structures are <code>if...else</code>, <code>switch</code> statements, and loops (<code>for</code>, <code>while</code>, <code>do...while</code>).</p>
      <p>These structures allow your program to make decisions and repeat actions based on different conditions.</p>
    </>
  ),
  "Data types and structures": (
    <p>JavaScript has seven primitive data types: String, Number, BigInt, Boolean, Undefined, Symbol, and Null, plus one complex type: Object.</p>
  ),
  "Numbers": (
    <p>The <strong>Number</strong> type is used for both integers and floating-point numbers. Special numerical values include <code>Infinity</code>, <code>-Infinity</code>, and <code>NaN</code> (Not a Number).</p>
  ),
  "Strings": (
    <p>A <strong>String</strong> is a sequence of characters used to represent text. Strings are immutable and can be created with single quotes, double quotes, or backticks (for template literals).</p>
  ),
  "Booleans": (
    <p>The <strong>Boolean</strong> type represents a logical entity and can only have two values: <code>true</code> or <code>false</code>.</p>
  ),
  "Null and undefined values": (
    <p><strong><code>null</code></strong> is an intentional absence of any object value. <strong><code>undefined</code></strong> means a variable has been declared but has not yet been assigned a value.</p>
  ),
  "BigInt": (
    <p><strong><code>BigInt</code></strong> is a primitive data type that can represent integers with arbitrary precision, which is useful for numbers larger than <code>Number.MAX_SAFE_INTEGER</code>.</p>
  ),
  "Symbols": (
    <p>A <strong>Symbol</strong> is a unique and immutable primitive value that may be used as the key of an object property. They are often used to create 'hidden' properties.</p>
  ),
  "Introduction to functions": (
    <p>A <strong>function</strong> is a block of code designed to perform a particular task. They are essential for organizing and reusing code.</p>
  ),
  "Function expressions": (
    <p>A <strong>function expression</strong> defines a function inside an expression (e.g., assigning it to a variable), unlike a function declaration, which is a standalone statement.</p>
  ),
  "The \"new\" keyword": (
    <p>The <strong><code>new</code> keyword</strong> is used to create an instance of a user-defined object type or a built-in object type that has a constructor function.</p>
  ),
  "The \"return\" keyword": (
    <p>The <strong><code>return</code> keyword</strong> stops the execution of a function and returns a value from that function. If omitted, the function returns <code>undefined</code>.</p>
  ),
  "The \"this\" keyword": (
    <p>The value of <strong><code>this</code></strong> depends on the context where it is used. In a simple function call, it often defaults to the global object (or <code>undefined</code> in strict mode), but in a method, it refers to the object itself.</p>
  ),
  "Introduction to objects": (
    <p>An <strong>object</strong> is a collection of related data and/or functionality (which are usually variables and functions, respectively) and are the most important data type in JavaScript.</p>
  ),
  "Property accessors": (
    <p><strong>Property accessors</strong> are methods used to get (getter) or set (setter) the value of an object's private property, giving you control over data access.</p>
  ),
  "Prototypal inheritance": (
    <p><strong>Prototypal inheritance</strong> is a mechanism where objects can inherit properties and methods from other objects, often referred to as their prototype.</p>
  ),
  "Property descriptors": (
    <p>A <strong>property descriptor</strong> is a record that holds attributes of a property (e.g., its value, whether it is writable, enumerable, or configurable). This is managed by the <code>Object.defineProperty()</code> method.</p>
  ),
  "Indexed collections": (
    <p><strong>Indexed collections</strong> store data in a specific order with numerical indexes, the primary example being the <strong>Array</strong>.</p>
  ),
  "Keyed collections": (
    <p><strong>Keyed collections</strong> store data with keys, such as <strong>Map</strong> (key/value pairs) and <strong>Set</strong> (unique values), providing more powerful and optimized data structures than generic objects.</p>
  ),
  "Introduction to classes": (
    <p><strong>Classes</strong> are a template for creating objects. They encapsulate data with code to work on that data, providing a more structured way to implement object-oriented programming.</p>
  ),
  "Extend classes": (
    <p>The <strong><code>extends</code> keyword</strong> is used in class declarations or class expressions to create a new class that is a child of another class, facilitating inheritance.</p>
  ),
  "Class fields and methods": (
    <p><strong>Class fields</strong> are properties defined directly on the class body, while <strong>methods</strong> are functions that perform actions related to the object.</p>
  ),
  "Static initialization blocks": (
    <p><strong>Static initialization blocks</strong> allow flexible initialization of static properties during the class definition, running once when the class is loaded.</p>
  ),
  "Appendix": (
    <p>The <strong>Appendix</strong> provides a reference of useful tools, documentation links, and advanced topics to continue your learning journey.</p>
  )
};

// Helper to create valid HTML id from topic
const toId = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const JavascriptPage = () => {
  return (
    <div className="flex min-h-screen font-sans bg-black text-slate-300">
      
      {/* 1. Header Navigation */}
      <WebDevBar />

      {/* 2. Side Panel */}
      <nav className="fixed top-[90px] left-0 h-[calc(100vh-90px)] w-[260px] border-r border-slate-800 bg-black overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700">
        <h2 className="mb-6 text-2xl font-bold text-teal-400 text-center underline decoration-teal-500/30 underline-offset-4">
          Contents
        </h2>
        <ul className="flex flex-col gap-2">
          {Jstopics.map((topic) => (
            <li key={topic}>
              <a
                href={`#${toId(topic)}`}
                className="block text-sm text-blue-500 hover:text-blue-400 transition-colors py-1"
              >
                {topic}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* 3. Main Content */}
      <main className="flex-1 ml-[260px] mt-[80px] p-10 pt-4 pr-[120px] max-w-6xl">
        {Jstopics.map((topic) => (
          <section
            key={topic}
            id={toId(topic)}
            className="mb-16 scroll-mt-[120px]"
          >
            <h2 className="text-3xl font-bold text-white mb-6 pb-2 border-b border-slate-800">
              {topic}
            </h2>
            <div className="text-lg leading-relaxed text-slate-300">
              {/* Render content */}
              {JstopicContent[topic] || <p className="text-slate-500 italic">Content coming soon...</p>}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default JavascriptPage;