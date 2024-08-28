import React from 'react';
import { useSpring, animated } from 'react-spring';
import WebSocketComponent from './WebSocketComponent';
import './styles.css';

function App() {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
  });

  return (
    <animated.div style={props}>
      <WebSocketComponent />
    </animated.div>
  );
}

export default App;
