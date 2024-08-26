// ButtonComponent.js
import React from 'react';
import { useSpring, animated } from 'react-spring';
import './styles.css';

const ButtonComponent = () => {
  const [isHovered, setHovered] = React.useState(false);

  const springProps = useSpring({
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });

  return (
    <animated.button
      className="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={springProps}
    >
      Hover me
    </animated.button>
  );
};

export default ButtonComponent;
