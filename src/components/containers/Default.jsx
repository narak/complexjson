
import React from 'react';
import PureComponent from 'react-pure-render/component';
import { connect } from 'redux-entity-data';
import * as UsersEntity from 'entities/Users';

/**
 * Checks if the user has enough details
 * @param  {Object}  user The user object from the state
 * @return {Boolean}      True if has enough details, false otherwise
 */
function hasEnoughDetails(user) {
    return user && user.getIn(['item', 'email']);
}

/**
 * Gets filters for connect entity data
 * @param  {Object} props Props from parent component
 * @return {Object}       Filters
 */
function getFilters(props) {
    return { id: props.userId };
}

@connect('user', UsersEntity, getFilters, {hasEnoughDetails})
class UserEdit extends PureComponent {
    render() {
        const { user } = this.props;
        const userVal = user.value;

        if (user.isFetching) {
            return (
                <div>Loading...</div>
            );
        }

        return (
            <div>
                <input type="text" size="20"
                    name="username"
                    value={userVal.get('username') || ''}
                    onChange={this.onUpdate}
                    placeholder="Username"
                    />
                <input type="text" size="20"
                    name="email"
                    value={userVal.get('email') || ''}
                    onChange={this.onUpdate}
                    placeholder="Email"
                    />
                <button type="button" name="save" onClick={this.onSave}
                    disabled={this._saveTrn && (this._saveTrn.isPending() || this._saveTrn.isSuccess())}
                >
                    {this._saveTrn ?
                        this._saveTrn.isPending() ? 'Saving' :
                        this._saveTrn.isSuccess() ? 'Saved' :
                        'Save Failed' :
                        'Save'
                    }
                </button>
                <button type="button" name="cancel" onClick={this.props.onCancel}>Cancel</button>
            </div>
        );
    }

    onUpdate = (e) => {
        this.props.onUpdate(
            this.props.user.value.set(e.target.name, e.target.value)
        );
    }

    onSave = () => {
        this._saveTrn = this.props.onSave(this.props.user.value);
    }
}

@connect('user', UsersEntity, getFilters)
class User extends PureComponent {
    state = {
        isEditing: false,
    }

    componentWillReceiveProps() {
        if (this._saveTrn && this._saveTrn.isSuccess()) {
            this._saveTrn = undefined;
            setTimeout(() => this.setState({isEditing: false}), 400);
        }
    }

    render() {
        const { user } = this.props;
        const { isEditing } = this.state;
        const userVal = user.value;

        if (!isEditing) {
            return (
                <div>
                    {userVal.get('username')}
                    <button type="button" name="edit" onClick={this.onEdit}>Edit</button>
                    <button type="button" name="delete" onClick={this.onDelete}>Delete</button>
                </div>
            );
        } else {
            return (
                <UserEdit userId={this.props.userId}
                    onCancel={this.onCancel}
                    onUpdate={this.props.onUpdate}
                    onSave={this.onSave}
                />
            );
        }
    }

    onSave = (value) => {
        this._saveTrn = this.props.onSave(value);
        return this._saveTrn;
    }

    onEdit = () => {
        this.setState({isEditing: true});
    }

    onCancel = () => {
        this.setState({isEditing: false});
    }

    onDelete = () => {
        return this.props.onDelete(this.props.user.value);
    }
}

@connect('users', UsersEntity, { locals: true })
export default class Default extends PureComponent {

    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }

    render() {
        const { users } = this.props;

        return (
            <div>
                <h3>Users:</h3>
                <ul>
                    {users.value && !users.isFetching ?
                        users.value.map(userId =>
                            <li key={userId}>
                                <User userId={userId}
                                    onUpdate={this.onUpdate}
                                    onDelete={this.onDelete}
                                    onSave={this.onSave}
                                    />
                            </li>
                        ) :
                        'Loading...'
                    }
                    {users.locals ?
                        users.locals.map(userId =>
                            <li key={userId}>
                                <User userId={userId}
                                    onUpdate={this.onUpdate}
                                    onDelete={this.onDelete}
                                    onSave={this.onSave}
                                    />
                            </li>
                        ) :
                        null
                    }
                </ul>
                <div>
                    <div>
                        <button onClick={this.createLocalUser}>Add User</button>
                    </div>
                </div>
                <br />
                <br />
                <br />
                <a href="#" onClick={this.onPeep}>Peep</a>
            </div>
        );
    }

    onPeep = (e) => {
        e.preventDefault();
        this.context.router.push('/peep');
    }

    createLocalUser = () => {
        return this.props.users.onCreate();
    }

    onUpdate = (item) => {
        return this.props.users.onUpdate({item});
    }

    onDelete = (item) => {
        return this.props.users.onDelete({item});
    }

    onSave = (item) => {
        return this.props.users.onSave({item});
    }
}
