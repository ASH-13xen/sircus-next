"use client";

import React from "react";
import WebDevBar from "@/components/WebDevbar";

// 1. Define strict types for your data
type TopicContentMap = {
  [key: string]: React.ReactNode;
};

const topics: string[] = [
  "Overview of HTML",
  "Document Structure",
  "Metadata",
  "Semantic HTML",
  "Headings and Sections",
  "Attributes",
  "Text Basics",
  "Links",
  "Lists",
  "Navigation",
  "Tablets",
  "Forms",
  "Images",
  "Audio and Video",
  "Template, Slot, and Shadow",
  "HTML APIs",
  "Focus",
  "Other Inline Text Elements",
  "Details and Summary",
  "Dialog",
  "Conclusion and Next Steps",
];

// 2. Standardized content structure
const topicContent: TopicContentMap = {
  "Overview of HTML": (
    <>
      <p className="mb-4">
        HyperText Markup Language, or HTML, is the standard markup language for describing the structure of documents displayed on the web. HTML consists of a series of elements and attributes which are used to mark up all the components of a document to structure it in a meaningful way.
      </p>
      <p className="mb-4">
        HTML documents are basically a tree of nodes, including HTML elements and text nodes. HTML elements provide the semantics and formatting for documents, including creating paragraphs, lists and tables, and embedding images and form controls.
      </p>
      
      <h2 className="text-teal-400 text-2xl font-bold mt-8 mb-4">Elements</h2>
      <p className="mb-4">
        HTML consists of a series of elements, which you use to enclose, or wrap, different parts of the content to make it appear or act in a certain way. HTML elements are delineated by tags, written using angle brackets (<code>&lt;</code> and <code>&gt;</code>).
      </p>
      
      <div className="bg-slate-900 p-4 border-l-4 border-teal-500 my-4 text-slate-300">
        Our page title is a heading, level one, for which we use the <code>&lt;h1&gt;</code> tag. The actual title, "Machine Learning Workshop", is the content of our element.
      </div>

      <div className="my-6">
        {/* Placeholder for the image */}
        <div className="w-full max-w-3xl h-64 bg-slate-900 rounded border border-slate-700 flex items-center justify-center text-slate-500">
             [Diagram of HTML Element Structure: Opening Tag + Content + Closing Tag]
        </div>
      </div>

      <p className="mb-4">Elements and tags aren't the exact same thing, though many people use the terms interchangeably.</p>

      <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-sm my-4 overflow-x-auto text-emerald-400">
        <pre>{`<p>This paragraph has some
  <strong><em>strongly emphasized</em></strong>
  content</p>`}</pre>
      </div>

      <p className="mb-4">Browsers do not display the tags. The tags are used to interpret the content of the page.</p>
    </>
  ),

  "Document Structure": (
    <>
      <p className="mb-4">
        HTML documents include a document type declaration and the <code>&lt;html&gt;</code> root element. Nested in the <code>&lt;html&gt;</code> element are the document head and document body.
      </p>
      <h2 className="text-teal-400 text-2xl font-bold mt-8 mb-4">Add to every HTML document</h2>
      <p className="mb-4">There are several features that should be considered essential for any and every web page.</p>
      
      <div className="bg-slate-950 p-3 rounded border border-slate-800 text-teal-300 font-mono mb-4">
        &lt;!DOCTYPE html&gt;
      </div>
      <p>The first thing in any HTML document is the preamble. It tells the browser to use standards mode.</p>
    </>
  ),

  "Metadata": (
    <p>Metadata provides information about the HTML document like the title, character set, author, and viewport settings, usually inside the <code>&lt;head&gt;</code> tag.</p>
  ),
  
  "Semantic HTML": (
    <p>Semantic HTML uses meaningful tags like <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;header&gt;</code>, and <code>&lt;footer&gt;</code> to describe the content’s purpose and structure.</p>
  ),
  
  "Headings and Sections": <p>Headings (h1 to h6) define the structure and hierarchy of content sections.</p>,
  "Attributes": <p>Attributes provide additional information about HTML elements, such as id, class, href, and src.</p>,
  "Text Basics": <p>Basic text formatting tags include paragraphs, line breaks, emphasis, and strong importance.</p>,
  "Links": <p>Links are created using the anchor tag, allowing users to navigate between pages.</p>,
  "Lists": <p>HTML supports ordered, unordered, and definition lists.</p>,
  "Navigation": <p>The nav element defines a section of navigation links.</p>,
  "Tablets": <p>Tables organize tabular data into rows and columns.</p>,
  "Forms": <p>Forms collect user input with elements like input, textarea, and buttons.</p>,
  "Images": <p>Images are embedded with the img tag and can include alt text.</p>,
  "Audio and Video": <p>HTML5 provides native multimedia support through audio and video tags.</p>,
  "Template, Slot, and Shadow": <p>Templates define reusable HTML fragments.</p>,
  "HTML APIs": <p>HTML APIs provide programmatic interfaces to enhance web functionality.</p>,
  "Focus": <p>Focus management controls which element is active.</p>,
  "Other Inline Text Elements": <p>Inline elements like span, code, mark, sub, and sup.</p>,
  "Details and Summary": <p>The details and summary elements create expandable sections.</p>,
  "Dialog": <p>The dialog element provides native support for modal dialog boxes.</p>,
  "Conclusion and Next Steps": <p>This section summarizes key HTML concepts covered.</p>,
};

// Helper to create valid HTML id from topic
const toId = (str: string): string =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const HtmlPage = () => {
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
          {topics.map((topic) => (
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
        {topics.map((topic) => (
          <section
            key={topic}
            id={toId(topic)}
            className="mb-16 scroll-mt-[120px]"
          >
            <h2 className="text-3xl font-bold text-white mb-6 pb-2 border-b border-slate-800">
              {topic}
            </h2>
            <div className="text-lg leading-relaxed text-slate-300">
              {topicContent[topic] || <p className="text-slate-500 italic">Content coming soon...</p>}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default HtmlPage;