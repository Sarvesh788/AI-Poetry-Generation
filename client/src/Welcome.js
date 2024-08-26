import React from 'react';
import { useSpring, animated } from 'react-spring';

const Welcome = ()  => {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 500,
  });

  return (
    <animated.div style={props}>
      <h1>Welcome</h1>
      <p>Integrate our API for comprehensive analytics.</p>
      <p>Unlock insights and maximize performance effortlessly.</p>
      <button>Connect your platform</button>
    </animated.div>
  );
}

export default Welcome;