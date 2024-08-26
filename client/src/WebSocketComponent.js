import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import './WebSocketComponent.css';

const WebSocketComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [poem, setPoem] = useState([]); // Store the poem in state
  const poemQueue = useRef([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8765');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      console.log(`Received part: ${event.data}`);
      poemQueue.current.push(event.data); // Add the new part to the queue
    };

    ws.current.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.error('WebSocket connection closed unexpectedly');
      }
    };

    ws.current.onerror = (error) => {
      console.error(`WebSocket error: ${error.message}`);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (poemQueue.current.length > 0) {
        const part = poemQueue.current.shift(); // Remove and get the first part from the queue
        setPoem((prevPoem) => [...prevPoem, part]); // Add part to the poem state
      }
    }, 500); // Adjust the interval timing as necessary for your application

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  const sendPrompt = () => {
    if (ws.current) {
      ws.current.send(prompt);
      setPrompt('');  // Clear the prompt input after sending
    }
  };

  return (
    <div className="poem-container">
      <div className="poem-output-container">
        <h3 className="poem-subheading">Generated Poem:</h3>
        <div className="poem-output">
          {poem.map((line, index) => (
            <PoemLine key={index} line={line} />
          ))}
        </div>
      </div>
      <div className="poem-input-container">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          className="poem-input"
        />
        <button onClick={sendPrompt} className="poem-button">Generate Poem</button>
      </div>
    </div>
  );
  
  
};

// Separate component for each line with animation
const PoemLine = ({ line }) => {
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 100 });
  return <animated.div style={fadeIn} className="poem-line">{line}</animated.div>;
};

export default WebSocketComponent;
