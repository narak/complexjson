
import React from 'react';
import PureComponent from 'react-pure-render/component';

import Entry from './Entry';

import json from '../../test';

export default class App extends PureComponent {

    state = {
        obj: JSON.parse(json),
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
            const obj = JSON.parse(this.refs.textarea.value);
            this.setState({obj});
        } catch (e) {
            alert(e);
        }
    }
}
