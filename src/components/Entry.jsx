import './entry.scss';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import cns from 'classnames';
import { is as isUuid } from 'utils/uuid';
import { ref } from 'utils/parse';

import Icon from './Icon';
import linkIcon from 'images/link.svg';

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
            let isRef;
            if (value === null) {
                valueCode = 'null';

            } else if (!value) {
                valueCode = 'undefined';

            } else if (typeof value === 'string') {
                isRef = isUuid(value) && key_ !== 'uuid';
                valueCode = value;

            } else {
                valueCode = value.toString();
            }

            const ref_ = isRef ? ref(valueCode) : null;

            valueCode = (
                <span className="value">
                    {valueCode}
                    {isRef ?
                        <a href={'#' + value}
                            className={cns('ref', {error: !ref_})}
                            data-tooltip={ref_ && ref_.keypath.join('.')}
                            title={ref_ && ref_.keypath.join('.')}
                            >
                                <Icon icon={linkIcon} />
                                {ref_ ? 'ref' : 'missing ref'}
                        </a> :
                        null
                    }
                </span>
            );
        }

        // If key_ is not present, its the root entry.
        const cls = cns('entry', {
            nested
        });

        const arrowCls = cns({
            'arrow-right': expanded,
            'arrow-down': !expanded,
        });

        return (
            <div className={cls}>
                {nested && value.uuid ?
                    <a name={value.uuid} /> :
                    null
                }

                {key_ !== undefined ?
                    <span onClick={nested ? this.toggle : null} className="key">
                        {nested ?
                            <span className={arrowCls} /> :
                            null
                        }
                        {key_}:&nbsp;
                    </span> :
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
