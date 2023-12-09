import React, { useEffect } from "react";

export const About = () => {
  return (
    <div className="home-top">
      <iframe
        title="External Content"
        src="https://chic-figolla-d7b7ea.netlify.app/"
        width="100%"
        height="600px"
        style={{
          overflow: "hidden",
          border: "0",
          marginWidth: "0",
          marginHeight: "0",
        }}
      />
      {/* Other content in your About component */}
    </div>
  );
};

export default About;
