import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './style.scss';

/**
 * @ngdoc react
 * @name Label
 * @description Form label component
 */
export const Label = ({text, row, light, invalid, noMinWidth, padding, marginLeft}) => (
    !text ? null : (
        <label className={classNames({
            'sd-line-input__label': !row,
            'form-label': row,
            'form-label--light': row && light,
            'form-label--invalid': row && invalid,
            'form-label--no-min-width': noMinWidth,
            'form-label--padding': padding,
            'form-label--left-margin': marginLeft,
        })}>
            {text}
        </label>
    )
);

Label.propTypes = {
    text: PropTypes.string,
    row: PropTypes.bool,
    light: PropTypes.bool,
    invalid: PropTypes.bool,
    noMinWidth: PropTypes.bool,
    padding: PropTypes.bool,
    marginLeft: PropTypes.bool,
};

Label.defaultProps = {
    row: false,
    light: false,
    invalid: false,
};
