import './app.scss';

import React from 'react';
import PureComponent from 'react-pure-render/component';
import cns from 'classnames';
import { parse } from 'utils/parse';

import Entry from './Entry';
import Icon from './Icon';
import pencilIcon from 'images/pencil.svg';

const CURRENT_INDEX = '@@current_index@@';
const OBJECTS = '@@objects@@';

let __objects = localStorage.getItem(OBJECTS);
let __currentIndex = +localStorage.getItem(CURRENT_INDEX) || 0;
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
        isEditing: !__objects[__currentIndex],
    }

    render() {
        const { objects, currentIndex, isEditing } = this.state;
        const obj = objects[currentIndex];

        const editorTabs = [0, 1, 2, 3, 4].map(i =>
            <button key={i}
                type="button"
                className={cns({'editor-tab-active': i === currentIndex})}
                onClick={this.onChangeTab.bind(this, i)}>{i + 1}</button>
        );

        if (!obj || isEditing) {
            const taStyle = {
                height: 'calc(100vh - 80px)'
            };

            return (
                <div className="app-container">
                    <div className="actions">
                        <button type="button" className="primary" onClick={this.onParse}>Parse</button>

                        <div className="editor-tabs">
                            TABS
                            {editorTabs}
                        </div>
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
                <div className="app-container">
                    <div className="actions">
                        <div className="search-field">
                            <input name="search_field"
                                type="text"
                                placeholder="Search (regex works)"
                                onKeyUp={this.onApplySearch}
                                onBlur={this.onChangeSearch}
                                />
                        </div>

                        <div className="editor-tabs">
                            <button type="button" onClick={this.onEdit} className="edit-button">
                                <Icon icon={pencilIcon} />
                            </button>
                            TABS
                            {editorTabs}
                        </div>
                    </div>
                    <Entry value={obj} searchTerm={this.state.searchTerm} />
                </div>
            );
        }
    }

    onApplySearch = (e) => {
        if (e.keyCode === 13) {
            this.onChangeSearch(e);
        }
    }

    onChangeSearch = (e) => {
        this.setState({ searchTerm: e.target.value ? new RegExp(e.target.value) : null});
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
