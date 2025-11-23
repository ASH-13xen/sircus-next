import React from "react";
import "@/css/learn.css";
import Cybersecuritycontents from "@/components/Cybersecuritycontents";

const Cyber = () => {
  return (
    <div>
      <h1 style={{ color: "white", fontSize: "40px", textAlign: "center" }}>
        Cybersecurity
      </h1>
      <div
        style={{
          backgroundColor: "#000000ff",
          width: "100%",
          overflowY: "auto",
          paddingTop: "1.5em",
        }}
      >
        <Cybersecuritycontents />
      </div>
    </div>
  );
};

export default Cyber;
