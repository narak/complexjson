
import React from 'react';
import PureComponent from 'react-pure-render/component';
import json from '../../test';

import { parse } from 'utils/parse';

import Entry from './Entry';

export default class App extends PureComponent {
    state = {
        obj: parse(json),
        isEditing: false,
    }

    render() {
        const { obj, isEditing } = this.state;

        if (!obj || isEditing) {
            return (
                <div>
                    <textarea name="obj_string" ref="textarea" defaultValue={obj ? JSON.stringify(obj, null, '    ') : ''} />
                    <button type="button" onClick={this.parseJSON}>Parse</button>
                </div>
            );

        } else {
            return (
                <Entry value={obj} />
            );
        }
    }

    parseJSON = () => {
        try {
            const obj = parse(this.refs.textarea.value);
            this.setState({obj});
        } catch (e) {
            alert(e);
        }
    }
}
