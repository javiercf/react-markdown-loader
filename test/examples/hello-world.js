import React from 'react';
import PropTypes from 'prop-types';

/**
 * Says hello to who
 * By default who is World
 * @param {Object} props React props
 * @returns {JSX} template
 */
export default function HelloWorld(props) {
  return <div className="hello-world">Hello { props.who }</div>;
}

HelloWorld.propTypes = { who: PropTypes.string };

HelloWorld.defaultProps = { who: 'World' };
