"use client";
const Cybersecuritytopics = [
    "What is Cybersecurity",
    "Protecting Your Data and Identity",
    "Data Location and Smart Devices",
    "Cyber Attacker Motives and Threats",
    "Organizational Security",
    "Cyber Attacker Classifications",
    "Protection Strategies",
    "Legal and Ethical Frameworks"
  ];
  
  const CybersecuritytopicContent = {
    "What is Cybersecurity": {
      "title": "What is Cybersecurity",
      "content": "Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. It's an essential defense mechanism encompassing technologies, processes, and controls designed to secure data and infrastructure from malicious threats.",
      "subheadings": {
        "Core Objectives (The CIA Triad)": [
          "**Confidentiality:** Preventing the unauthorized disclosure of information.",
          "**Integrity:** Ensuring the accuracy and completeness of data; preventing tampering.",
          "**Availability:** Guaranteeing that authorized users can access information and systems when needed."
        ]
      }
    },
    "Protecting Your Data and Identity": {
      "title": "Protecting Your Data and Identity",
      "content": "This addresses the personal steps you must take to secure your digital life and prevent unauthorized access to your private information.",
      "subheadings": {
        "Protecting Your Personal Data": [
          "**Strong Authentication:** Using strong, unique passwords and enabling **Multi-Factor Authentication (MFA)** on all critical accounts.",
          "**Data Scrutiny:** Being cautious about what personal information you share online and which websites you trust."
        ],
        "Your Online Identity": [
          "**Digital Persona:** The sum of your accounts, profiles, and digital footprint.",
          "**Guard Against Hijacking:** Preventing criminals from taking over your accounts to post malicious content or commit fraud."
        ]
      }
    },
    "Data Location and Smart Devices": {
      "title": "Data Location and Smart Devices",
      "content": "Understanding where your data resides and the specific threats posed by modern connected technology.",
      "subheadings": {
        "Where is Your Data": [
          "**Local Storage:** Files on your personal computers, phones, and external drives.",
          "**Cloud Storage:** Data stored on remote servers managed by third-party providers.",
          "**Organizational Servers:** Data held by financial, retail, and healthcare institutions."
        ],
        "Smart Devices (IoT)": [
          "**The Connected Threat:** **Internet of Things (IoT)** devices (thermostats, cameras) often have weak or default security settings.",
          "**Network Entry Point:** Exploited devices can be used by hackers as an easy entry point to compromise your entire home network."
        ]
      }
    },
    "Cyber Attacker Motives and Threats": {
      "title": "Cyber Attacker Motives and Threats",
      "content": "A look at who is attacking digital systems and their primary motivations, ranging from financial to political.",
      "subheadings": {
        "What Do Hackers Want": [
          "**Financial Gain:** Theft (credit card numbers), **ransomware** (extortion), and bank fraud.",
          "**Espionage:** Stealing corporate secrets (IP) or classified information (state-sponsored attacks).",
          "**Disruption/Vandalism:** Making political or social statements (**Hacktivism**)."
        ],
        "Identify Theft": [
          "**Mechanism:** Stealing Personally Identifiable Information (**PII**) to impersonate the victim and commit fraud.",
          "**Consequences:** Ruined credit, unauthorized accounts, and financial loss."
        ],
        "Who else wants my Data": [
          "**Corporations:** For **targeted advertising** and market research.",
          "**Governments/State Actors:** For surveillance and intelligence gathering."
        ]
      }
    },
    "Organizational Security": {
      "title": "Organizational Security",
      "content": "The complexities of protecting a business or institution, including various data types and threat origins.",
      "subheadings": {
        "Organizational Data Types": [
          "**Intellectual Property (IP):** Trade secrets and proprietary research.",
          "**Customer/Client Data:** PII and payment history (subject to **GDPR/HIPAA**).",
          "**Financial and HR Data:** Budgets, payroll, and employee health records."
        ],
        "Internal and External Threats": [
          "**Internal Threat:** Danger originating from **within** (disgruntled or accidental employee action).",
          "**External Threat:** Danger originating from **outside** (hacker groups, nation-states)."
        ],
        "Data Security Breaches & Consequences": [
          "**Breach Definition:** An incident where sensitive data is illegally accessed or stolen.",
          "**Consequences:** High financial costs (fines, remediation), reputational damage, and legal penalties."
        ]
      }
    },
    "Cyber Attacker Classifications": {
      "title": "Cyber Attacker Classifications (The Hat System)",
      "content": "A system used to categorize attackers based on their intent, morality, and legality.",
      "subheadings": {
        "The Hat System": [
          "**White Hat** (Ethical Hacker): Works to improve security with permission; legal.",
          "**Black Hat** (Malicious Hacker): Violates security for personal gain or malice; illegal.",
          "**Grey Hat** (Consultant/Activist): Finds vulnerabilities without permission, then discloses or offers a fix; legality varies."
        ]
      }
    },
    "Protection Strategies": {
      "title": "Protection Strategies",
      "content": "The technical and procedural steps required to implement robust security across devices, networks, and organizations.",
      "subheadings": {
        "Protecting your Device and Network": [
          "**Patch Management:** Regularly updating (patching) OS and applications to fix vulnerabilities.",
          "**Defense Software:** Using and maintaining anti-virus, anti-malware, and firewall solutions.",
          "**Network Security:** Securing Wi-Fi with strong passwords and modern encryption (WPA3)."
        ],
        "Protecting the Organization": [
          "**Access Control:** Implementing the **Principle of Least Privilege (PoLP)**.",
          "**Training & Planning:** Mandatory **Security Awareness Training** and a tested **Incident Response Plan**."
        ]
      }
    },
    "Legal and Ethical Frameworks": {
      "title": "Legal and Ethical Frameworks",
      "content": "The complex landscape of laws and moral obligations that govern the practice of cybersecurity.",
      "subheadings": {
        "Legal Issues": [
          "**Regulatory Compliance:** Adhering to laws like **GDPR, CCPA,** and **HIPAA** regarding data privacy and protection.",
          "**Jurisdiction:** Addressing the challenges of cybercrime that crosses international borders."
        ],
        "Ethical Obligations": [
          "**Privacy vs. Security:** Balancing the need for surveillance/data access against user privacy rights.",
          "**Code of Conduct:** The ethical responsibility of security professionals to secure user data and operate legally."
        ]
      }
    }
  };


  import React from 'react';

// ... (Your constant data objects: Cybersecuritytopics, CybersecuritytopicContent, toId helper)

const toId = (str: string) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const Cybersecuritycontents = () => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#000000ff",
        color: "#ffffff", // 🌟 FIXED: Changed to white/visible color
      }}
    >
      {/* Side Panel (Navigation) */}
      <nav
        style={{
          width: "260px",
          height: "90vh",
          position: "fixed",
          top: 60,
          left: 0,
          borderRight: "1px solid #555", // Slightly adjusted border for black background
          padding: "24px 16px",
          background: "#000000ff",
          overflowY: "auto",
        }}
      >
        <h2 style={{
          marginBottom: "16px",
          fontWeight: "bold",
          fontSize: "1.5em",
          color: "#93b9b2",
          textAlign: "center",
          textDecoration: "underline"
        }}>
          Contents
        </h2>
        <ul style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          {Cybersecuritytopics.map((topic) => (
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
                onMouseOver={(e) => (e.currentTarget.style.color = "#4ba0f2")} // Updated hover color
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
          paddingLeft: "280px", // Adjusted: Should be > width of fixed nav (260px) + some padding
          paddingRight: "60px", 
          overflowY: "auto",
          color: "#93b9b2",
          fontSize: "16px", // Adjusted: 26px might be too large for body text
          paddingTop: "10px",
          width: "100%",
          background: "#000000ff",
        }}
      >
        {Cybersecuritytopics.map((topic) => {
          const contentData = CybersecuritytopicContent[topic];
          return (
            <section
              key={topic}
              id={toId(topic)}
              style={{
                marginBottom: "48px",
                scrollMarginTop: "60px", // Adjust for sticky header/nav if any
              }}
            >
              <h2 style={{ color: "#93b9b2", borderBottom: '2px solid #93b9b2', paddingBottom: '5px' }}>
                {contentData.title}
              </h2>
              
              {/* 🌟 FIXED: Accessing the .content property */}
              <p style={{ color: "#ffffffff", lineHeight: "1.6", padding: "1em 0" }}>
                {contentData.content}
              </p>

              {/* 🌟 FIXED: Rendering Subheadings */}
              {Object.entries(contentData.subheadings).map(([subheadingTitle, points]) => (
                <div key={subheadingTitle} style={{ marginBottom: '20px', marginLeft: '20px' }}>
                  <h3 style={{ color: "#93b9b2", fontSize: "1.2em", marginBottom: "10px" }}>
                    {subheadingTitle}
                  </h3>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    {points.map((point, index) => (
                      <li key={index} 
                          // Dangerously set inner HTML to render **bold text** from data
                          dangerouslySetInnerHTML={{ __html: point }}
                          style={{ marginBottom: '8px', lineHeight: '1.4', color: '#ffffff' }}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          );
        })}
      </main>
    </div>
  );
};
 
export default Cybersecuritycontents;