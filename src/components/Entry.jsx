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
        const { value, key_, searchTerm } = this.props;
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
                    <span className="nested">
                        {'['}
                        <div className="indent">
                            {value.map((v, i) =>
                                <Entry key={i}
                                    key_={i}
                                    value={v}
                                    parentKey={key_}
                                    parentValue={value}
                                    searchTerm={searchTerm}
                                />
                            )}
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
                            {keys.map(k =>
                                <Entry key={k}
                                    key_={k}
                                    value={value[k]}
                                    parentKey={key_}
                                    parentValue={value}
                                    searchTerm={searchTerm}
                                />
                            )}
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

                const parentValue = this.props.parentValue;
                isRef = parentValue.kind && parentValue.uuid && parentValue.name &&
                    key_ === 'uuid';
                valueCode = value;

            } else {
                valueCode = value.toString();
            }

            const ref_ = isRef ? ref(valueCode) : null;

            let matched = false;
            if (searchTerm && valueCode && typeof valueCode === 'string') {
                matched = searchTerm.test(valueCode);
            }

            valueCode = (
                <span className="value">
                    {matched ?
                        <strong className="search-matched">{valueCode}</strong> :
                        valueCode
                    }
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

        let matched = false;
        if (searchTerm && key_ && typeof key_ === 'string') {
            matched = searchTerm.test(key_);
        }

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
                        {matched ?
                            <strong className="search-matched">{key_}</strong> :
                            key_
                        }
                        :&nbsp;
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
