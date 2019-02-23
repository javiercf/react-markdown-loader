import React from 'react';
import PropTypes from 'prop-types';

/**
 * Button
 * @param {Object} props React props
 * @returns {JSX} template
 */
export default function Button({ label }) {
  return <button className="button" type="button">{label}</button>;
}

Button.propTypes = { label: PropTypes.string };

Button.defaultProps = { label: 'World' };
