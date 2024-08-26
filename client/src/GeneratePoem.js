import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

const PoemGenerator = () => {
  const [poem, setPoem] = useState([]);
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 200 });

  const generatePoem = () => {
    // Call your API to get the poem and set it to state
    const newPoem = ["Line 1 of the poem", "Line 2 of the poem", "Line 3 of the poem"];
    setPoem(newPoem);
  };

  return (
    <div style={{ padding: '20px', background: '#111', color: '#fff' }}>
      <h1 style={{ color: '#fff' }}>AI Poetry Generator</h1>
      <input type="text" placeholder="Enter your prompt" style={{ marginBottom: '20px', padding: '10px' }} />
      <button onClick={generatePoem} style={{ padding: '10px 20px' }}>Generate Poem</button>
      <div style={{ marginTop: '20px' }}>
        {poem.map((line, index) => (
          <animated.div key={index} style={fadeIn}>
            {line}
          </animated.div>
        ))}
      </div>
    </div>
  );
};

export default PoemGenerator;
