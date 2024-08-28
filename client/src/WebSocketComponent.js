import React, { useEffect, useState, useRef } from 'react';
import { useSpring, animated } from '@react-spring/web';
import UseSpeechRecognition from './UseSpeechRecognition';
import './WebSocketComponent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faPen } from '@fortawesome/free-solid-svg-icons';
import SettingsModal from './SettingsModal';
import * as d3 from 'd3';

const WebSocketComponent = () => {
  const [prompt, setPrompt] = useState('');
  const [poem, setPoem] = useState([]);
  const poemQueue = useRef([]);
  const ws = useRef(null);
  const [transcript, isListening, setIsListening, setTranscript] = UseSpeechRecognition();
  const [isModalOpen, setModalOpen] = useState(false);
  const [settings, setSettings] = useState({
    happiness: 5,
    strength: 5,
    length: 5,
    rhyme: 5,
    grammar: 5,
  });
  const [poemParameters, setPoemParameters] = useState({});

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const saveSettings = (newSettings) => setSettings(newSettings);

  const parseParameters = (text) => {
    const parameters = ['Happiness', 'Terrifying', 'Grammar', 'Rhyming'];
    const result = {};
    
    parameters.forEach(param => {
      const regex = new RegExp(`${param}:\\s*(\\d+)`);
      const match = text.match(regex);
      if (match) {
        result[param] = parseInt(match[1]);
      }
    });
    
    return result;
  };

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8765');

    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      console.log(`Received part: ${event.data}`);
      const newPart = event.data;
      poemQueue.current.push(newPart);
      
      // Check if this is the last part of the poem
      if (newPart.includes('Happiness:')) {
        const params = parseParameters(newPart);
        setPoemParameters(params);
      }
    };

    ws.current.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.error('WebSocket connection closed unexpectedly. Code:', event.code, 'Reason:', event.reason);
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
        const part = poemQueue.current.shift();
        setPoem((prevPoem) => [...prevPoem, part]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isListening) {
      setPrompt(transcript);
    }
  }, [isListening, transcript]);

  useEffect(() => {
    d3.select("#d3-container").selectAll("svg").remove();

    if (Object.keys(poemParameters).length === 0) return;

    const width = 380;
    const height = 380;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right);

    const svg = d3.select("#d3-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const data = Object.entries(poemParameters).map(([parameter, intensity]) => ({ parameter, intensity }));

    const radialScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, radius]);

    const angleScale = d3.scaleBand()
      .domain(data.map(d => d.parameter))
      .range([0, 2 * Math.PI]);

    // Draw axis lines and labels
    data.forEach(d => {
      const angle = angleScale(d.parameter);
      const x = radialScale(100) * Math.cos(angle - Math.PI / 2);
      const y = radialScale(100) * Math.sin(angle - Math.PI / 2);
      
      svg.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", "#555")
        .attr("stroke-width", 1);
    
      svg.append("text")
        .attr("x", x * 1.1)
        .attr("y", y * 1.1)
        .attr("text-anchor", angle > Math.PI / 2 && angle < 3 * Math.PI / 2 ? "end" : "start")
        .attr("dominant-baseline", "middle")
        .attr("fill", "#fff")
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .text(d.parameter);
    });
          
    // Draw data points
    svg.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => radialScale(d.intensity) * Math.cos(angleScale(d.parameter) - Math.PI / 2))
      .attr("cy", d => radialScale(d.intensity) * Math.sin(angleScale(d.parameter) - Math.PI / 2))
      .attr("r", 4)
      .attr("fill", "#ff9f43");

    // Add value labels
    svg.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => radialScale(d.intensity) * Math.cos(angleScale(d.parameter) - Math.PI / 2))
      .attr("y", d => radialScale(d.intensity) * Math.sin(angleScale(d.parameter) - Math.PI / 2))
      .attr("dx", 8)
      .attr("dy", 3)
      .attr("text-anchor", "start")
      .attr("font-size", "10px")
      .attr("fill", "#fff")
      .text(d => `${d.intensity}%`);

    // Draw the shape
    const lineGenerator = d3.lineRadial()
      .radius(d => radialScale(d.intensity))
      .angle(d => angleScale(d.parameter));

    svg.append("path")
      .datum(data)
      .attr("d", lineGenerator)
      .attr("fill", "rgba(0, 128, 255, 0.3)")
      .attr("stroke", "#ff9f43")
      .attr("stroke-width", 2);

  }, [poemParameters]);

  const sendPrompt = () => {
    setPoem([]);
    setPoemParameters({});
    poemQueue.current = [];
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      let textToSend = transcript || prompt;

      if (textToSend) {
        textToSend += ". The parameters values to be considered for generation/10: ";
        textToSend += `happiness: ${settings.happiness}, `;
        textToSend += `strength: ${settings.strength}, `;
        textToSend += `length: ${settings.length * 6}, `;
        textToSend += `rhyme: ${settings.rhyme}, `;
        textToSend += `grammar: ${settings.grammar}.`;
        
        ws.current.send(textToSend);
        setPrompt('');  
        setTranscript(''); 
      } else {
        console.error("No text to send.");
      }
    } else {
      console.error("WebSocket is not open yet. Cannot send message.");
    }
  };

  return (
    <div className="poem-container">
      <div className="poem-content">

        <div className="poem-output-container">
          <h3 className="poem-subheading">Generated Poem:</h3>
          <div className="poem-output">
            {poem.map((line, index) => (
              <PoemLine key={index} line={line} />
            ))}
          </div>
        </div>
        <button className="settings-button" onClick={openModal}>Settings</button>
        <SettingsModal isOpen={isModalOpen} onClose={closeModal} onSave={saveSettings} />
        {Object.keys(poemParameters).length > 0 && (
          <div id="d3-container"></div>
        )}
        <div className="poem-input-container">
          <button onClick={() => setIsListening(prev => !prev)} className="poem-button" id="start-listening">
            <FontAwesomeIcon icon={faMicrophone} style={{ color: isListening ? 'blue' : 'inherit' }}/>
          </button>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            className="poem-input"
          />
          <button onClick={sendPrompt} className="poem-button" id="generate-poem">
            <FontAwesomeIcon icon={faPen}/> Generate Poem
          </button>
        </div>
      </div>
    </div>
  );
};

const PoemLine = ({ line }) => {
  const fadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, delay: 100 });
  return <animated.div style={fadeIn} className="poem-line">{line}</animated.div>;
};

export default WebSocketComponent;