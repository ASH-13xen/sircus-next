import React from "react";
import Aimlcontents from '@/components/Aimlcontents';

const AIML = () => (
  <div>
      <div>
        <h1 style={{ color: "#ffffffff", textAlign: "center", fontSize: "2em", fontWeight: "bold" }}>Artificial Intelligence and Machine Learning</h1>
      </div>
      <div style={{ backgroundColor: "#000000ff", width: "100%", overflowY: "auto", paddingTop: '1.5em'}}>
        <Aimlcontents />
      </div>
    </div>
);

export default AIML;