"use client";
import React from "react";
import "@/css/scrollbar.css";

const aimltopics = [
  "Intro to AI & ML",
  "Box Model",
  "Selectors",
  "Nesting",
  "The cascade",
  "Specificity",
  "Inheritance",
  "Color",
  "Sizing Units",
  "Layout",
  "Flexbox",
  "Grid",
  "Logical Properties",
  "Custom Properties",
  "Spacing",
  "Pseudo-elements",
  "Pseudo-classes",
  "Borders",
  "Shadows",
  "Focus",
  "Cursors and pointers",
  "Z-index and stacking contexts",
  "Anchor positioning",
  "Popover and dialog",
  "Functions",
  "Paths, shapes, clipping, and masking",
  "Gradients",
  "Animations",
  "Filters",
  "Blend Modes",
  "Lists",
  "Counters",
  "Transitions",
  "View Transitions for SPAs",
  "Overflow",
  "Backgrounds",
  "Text and typography",
  "Container queries",
  "Conclusion and next steps",
];

const aimltopicContent: Record<string, string> = {
  "Intro to AI & ML":
    "Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn. Machine Learning (ML) is a subset of AI that focuses on the development of algorithms that allow computers to learn from and make predictions or decisions based on data.",
  "Box Model":
    "The core concept that all HTML elements are rendered as boxes with content, padding, borders, and margins.",
  Selectors:
    "Patterns used to select and target the HTML elements you want to style (e.g., class, ID, element type).",
  Nesting:
    "A modern CSS feature (and preprocessor feature) that allows writing nested style rules, following the HTML structure.",
  "The cascade":
    "The process that determines which styles apply when multiple rules try to style the same element, based on origin, specificity, and order.",
  Specificity:
    "The algorithm that determines which CSS rule applies to an element when multiple rules target it, based on the selector type (ID > Class > Element).",
  Inheritance:
    "The mechanism where some CSS properties (like `color` and `font-size`) are automatically passed down from a parent element to its children.",
  Color:
    "Defining the foreground and background colors of elements using keywords, hexadecimal, RGB, HSL, or newer color spaces like LCH and LAB.",
  "Sizing Units":
    "Various ways to define dimensions, including absolute units (`px`) and relative units (`em`, `rem`, `%`, `vw`, `vh`, etc.).",
  Layout:
    "General techniques and principles for arranging elements on a webpage, often using Flexbox and Grid.",
  Flexbox:
    "A one-dimensional CSS layout module for arranging items in a single row or column.",
  Grid: "A two-dimensional CSS layout module for arranging items into rows and columns.",
  "Logical Properties":
    "Properties that define spacing and dimensions relative to the flow direction (e.g., `margin-inline-start`) instead of physical directions (e.g., `margin-left`).",
  "Custom Properties":
    "CSS variables (`--variable-name`) used to store and reuse values throughout a stylesheet.",
  Spacing:
    "Controlling the internal (`padding`) and external (`margin`) distance around elements, managed by the Box Model.",
  "Pseudo-elements":
    "Keywords that let you style a specific part of an element (e.g., `::before`, `::after`).",
  "Pseudo-classes":
    "Keywords that select elements based on their state or position (e.g., `:hover`, `:focus`, `:nth-child`).",
  Borders:
    "The lines drawn around the padding of an element, controllable in terms of style, width, and color.",
  Shadows:
    "Applying visual effects like `box-shadow` for elements and `text-shadow` for text.",
  Focus:
    "Managing the visual indication when an element receives keyboard input focus, critical for accessibility.",
  "Cursors and pointers":
    "Customizing the mouse cursor that appears when a user hovers over an element.",
  "Z-index and stacking contexts":
    "Controlling the vertical stacking order of elements that overlap on the screen.",
  "Anchor positioning":
    "A newer feature for positioning an element relative to a specific 'anchor' element.",
  "Popover and dialog":
    "Styling for built-in, non-modal (`popover`) and modal (`dialog`) window elements.",
  Functions:
    "Built-in CSS tools like `calc()`, `var()`, `min()`, `max()`, and `clamp()` for dynamic value calculation.",
  "Paths, shapes, clipping, and masking":
    "Advanced techniques for defining the non-rectangular shape of an element's area or its visible region.",
  Gradients:
    "Creating smooth transitions between two or more colors (linear, radial, or conic).",
  Animations:
    "Creating complex, multi-step motion effects using `@keyframes` and the `animation` property.",
  Filters:
    "Applying graphical effects like blur, grayscale, sepia, and brightness adjustments to an element.",
  "Blend Modes":
    "Controlling how an element's color blends with the colors below it (`mix-blend-mode` and `background-blend-mode`).",
  Lists:
    "Styling ordered (`<ol>`) and unordered (`<ul>`) lists, including markers and list position.",
  Counters: "Using CSS to create sequences of numbered content automatically.",
  Transitions:
    "Creating smooth, gradual changes in CSS property values over a specified duration.",
  "View Transitions for SPAs":
    "A modern API for smooth, animated transitions between different page states or views in a Single Page Application.",
  Overflow:
    "Specifying how content that is too large to fit in an element's box should be handled (e.g., `scroll`, `hidden`).",
  Backgrounds:
    "Controlling background colors, images, size, position, and repetition within an element.",
  "Text and typography":
    "Styling the appearance of text, including font family, size, weight, line height, and alignment.",
  "Container queries":
    "Applying styles based on the size of a parent container, rather than the viewport size.",
  "Conclusion and next steps":
    "Summary of the curriculum and guidance on advanced topics or real-world application.",
};

// Helper to create valid HTML id from topic
const toId = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Jscontent = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#000000ff",
        color: "#000000ff",
      }}
    >
      {/* Side Panel */}
      <nav
        style={{
          width: "260px",
          height: "90vh", // Full viewport height
          position: "fixed", // Fix it to viewport
          top: 60,
          left: 0,
          borderRight: "1px solid #ddd",
          padding: "24px 16px",
          background: "#000000ff",
          overflowY: "auto",
        }}
      >
        <h2
          style={{
            marginBottom: "16px",
            fontWeight: "bold",
            fontSize: "1.5em",
            color: "#93b9b2",
            textAlign: "center",
            textDecoration: "underline",
          }}
        >
          Contents
        </h2>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {aimltopics.map((topic) => (
            <li key={topic}>
              <a
                href={`#${toId(topic)}`}
                style={{
                  textDecoration: "none",
                  color: "#0366d6",
                  fontSize: "16px",
                  transition: "color 0.2s",
                  cursor: "pointer",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#024b9a")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#0366d6")}
              >
                {topic}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          paddingLeft: "430px",
          paddingRight: "120px", // To avoid overlap with side panel
          overflowY: "auto",
          color: "#93b9b2",
          fontSize: "26px",
          paddingTop: "10px",
          width: "100%",
          background: "#000000ff",
        }}
      >
        {aimltopics.map((topic) => (
          <section
            key={topic}
            id={toId(topic)}
            style={{
              marginBottom: "48px",
              scrollMarginTop: "130px", // Adjust this if you have a fixed header
            }}
          >
            <h2>{topic}</h2>
            <p
              style={{
                color: "#ffffffff",
                fontSize: "16px",
                width: "81%",
                lineHeight: "1.6",
                padding: "1em",
              }}
            >
              {aimltopicContent[topic]}
            </p>
          </section>
        ))}
      </main>
    </div>
  );
};

export default Jscontent;
