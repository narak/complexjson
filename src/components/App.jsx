import './app.scss';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import cns from 'classnames';

import { parse } from 'utils/parse';

import Entry from './Entry';

const CURRENT_INDEX = '@@current_index@@';
const OBJECTS = '@@objects@@';

let __objects = localStorage.getItem(OBJECTS);
let __currentIndex = localStorage.getItem(CURRENT_INDEX) || 0;
if (__objects) {
    __objects = JSON.parse(__objects);
    if (__currentIndex !== undefined && __objects[__currentIndex]) {
        parse(__objects[__currentIndex]);
    }
} else {
    __objects = [];
}

export default class App extends PureComponent {
    state = {
        objects: __objects,
        currentIndex: __currentIndex,
        isEditing: false,
    }

    render() {
        const { objects, currentIndex, isEditing } = this.state;
        const obj = objects[currentIndex];

        const editorTabs = (
            <div className="editor-tabs">
                TABS
                {[0, 1, 2, 3, 4].map(i =>
                    <button key={i}
                        type="button"
                        className={cns({'editor-tab-active': i === currentIndex})}
                        onClick={this.onChangeTab.bind(this, i)}>{i + 1}</button>
                )}
            </div>
        );

        if (!obj || isEditing) {
            const taStyle = {
                height: 'calc(100vh - 80px)'
            };

            return (
                <div>
                    <div className="actions">
                        <button type="button" onClick={this.onParse}>Parse</button>
                        {editorTabs}
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
                        {editorTabs}
                    </div>
                    <Entry value={obj} />
                </div>
            );
        }
    }

    onChangeTab = (currentIndex) => {
        localStorage.setItem(CURRENT_INDEX, currentIndex);
        this.setState({currentIndex});
    }

    onEdit = () => {
        this.setState({isEditing: true});
    }

    onParse = () => {
        try {
            const obj = parse(this.refs.textarea.value);
            const { objects, currentIndex } = this.state;
            const newObjects = [...objects];
            newObjects[currentIndex] = obj;
            localStorage.setItem(OBJECTS, JSON.stringify(newObjects));
            this.setState({
                objects: newObjects,
                isEditing: false,
            });
        } catch (e) {
            alert(e);
        }
    }
}
