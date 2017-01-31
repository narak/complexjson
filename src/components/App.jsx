
import React from 'react';
import PureComponent from 'react-pure-render/component';

import { parse } from 'utils/parse';

import Entry from './Entry';

export default class App extends PureComponent {
    state = {
        obj: null,
        isEditing: false,
    }

    render() {
        const { obj, isEditing } = this.state;

        if (!obj || isEditing) {
            const taStyle = {
                height: 'calc(100vh - 80px)'
            };

            return (
                <div>
                    <div className="actions">
                        <button type="button" onClick={this.onParse}>Parse</button>
                    </div>
                    <textarea name="obj_string"
                        placeholder="JSON string goes here..."
                        ref="textarea"
                        style={taStyle}
                        defaultValue={obj ? JSON.stringify(obj, null, '    ') : ''} />
                </div>
            );

        } else {
            return (
                <div>
                    <div className="actions">
                        <button type="button" onClick={this.onEdit}>Edit</button>
                    </div>
                    <Entry value={obj} />
                </div>
            );
        }
    }

    onEdit = () => {
        this.setState({isEditing: true});
    }

    onParse = () => {
        try {
            const obj = parse(this.refs.textarea.value);
            this.setState({obj, isEditing: false});
        } catch (e) {
            alert(e);
        }
    }
}
