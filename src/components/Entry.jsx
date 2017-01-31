import './entry.scss';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import cns from 'classnames';

export default class Entry extends PureComponent {
    state = {
        expanded: true,
    }

    render() {
        const { value, key_ } = this.props;
        const { expanded } = this.state;

        let nested;
        let valueCode;

        if (value && Array.isArray(value)) {
            nested = true;

            if (!value.length) {
                valueCode = '[]';

            } else if (!expanded) {
                valueCode = '[...]';

            } else {
                valueCode = (
                    <span>
                        {'['}
                        <div className="indent">
                            {value.map((v, i) => <Entry key={i} key_={i} value={v} />)}
                        </div>
                        {']'}
                    </span>
                );
            }

        } else if (value && typeof value === 'object') {
            nested = true;
            const keys = Object.keys(value);

            if (!keys.length) {
                valueCode = '{}';

            } else if (!expanded) {
                valueCode = '{...}';

            } else {
                valueCode = (
                    <span className="nested">
                        {'{'}
                        <div className="indent">
                            {keys.map(k => <Entry key={k} key_={k} value={value[k]} />)}
                        </div>
                        {'}'}
                    </span>
                );
            }

        } else {
            if (value === null) {
                valueCode = 'null';

            } else if (!value) {
                valueCode = 'undefined';

            } else {
                valueCode = value.toString();
            }
            valueCode = <span className="value">{valueCode}</span>;
        }

        // If key_ is not present, its the root entry.
        const cls = cns('entry', {
            indent: key_ !== undefined,
            nested
        });

        const arrowCls = cns({
            'arrow-right': expanded,
            'arrow-down': !expanded,
        });
        return (
            <div className={cls}>
                {key_ !== undefined ?
                    <span onClick={nested ? this.toggle : null} className="key">
                        {nested ?
                            <span className={arrowCls} /> :
                            null
                        }
                        {key_}: </span>
                     :
                    null
                }
                {valueCode}
            </div>
        );
    }

    toggle = (e) => {
        e.stopPropagation();
        this.setState({expanded: !this.state.expanded});
    }
}
