import React from 'react';
import PropTypes from 'prop-types';

/**
 * Says hello to who
 * By default who is World
 * @param {Object} props React props
 * @returns {JSX} template
 */
export default function HelloWorld({ who }) {
  return (
    <div className="hello-world">
      Hello
      {who}
    </div>
  );
}

HelloWorld.propTypes = { who: PropTypes.string };

HelloWorld.defaultProps = { who: 'World' };
