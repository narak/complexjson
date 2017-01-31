
import './icon.scss';

import React from 'react';
import cns from 'classnames';

/**
 * Simple Icon component.
 * @param {Object} props Props object
 * @returns {ReactComponent} React Icon component
 */
export default function Icon(props) {
    return <span className={cns('icon', props.className)} dangerouslySetInnerHTML={{__html: props.icon}} />;
}
