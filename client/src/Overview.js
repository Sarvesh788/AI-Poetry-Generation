import React from 'react';
import { useSpring, animated } from 'react-spring';

function Overview() {
  const props = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    delay: 1000,
  });

  return (
    <animated.div style={props}>
      <h1>Overview</h1>
      <ul>
        <li>
          <span>General statistics</span>
          <span>Ads clicks +247%</span>
        </li>
        <li>
          <span>Trends 2024</span>
          <span>Total salary</span>
        </li>
        <li>
          <span>Social network</span>
          <span>
            ⚫ Without ad campaign
            <br />
            With ad campaign
          </span>
        </li>
      </ul>
      <h2>List of platforms</h2>
      <ul>
        <li>Instagram</li>
        <li>Google Ads</li>
      </ul>
      <p>Instagram - the most traffic platform</p>
      <p>+7.5k</p>
      <p>+139%</p>
      <p>+4.5k</p>
    </animated.div>
  );
}

export default Overview;