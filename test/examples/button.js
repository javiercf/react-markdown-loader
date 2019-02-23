import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button
 * @param {Object} props React props
 * @returns {JSX} template
 */
export default function Button(props) {
  return <button className="button">{ props.label }</button>;
}

Button.propTypes = { label: PropTypes.string };

Button.defaultProps = { label: 'World' };
