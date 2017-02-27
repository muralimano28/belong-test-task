/*
 * This is the starting point of the app.
 * This page will include all other containers here.
 * Other containers are header, sidebar, content and footer.
 */

import React, { Component } from 'react';

// Styles.
import './style.css';

// Action creators.
import Actions from 'actions';

// Stores.
import Store from 'stores';

export default class App extends Component {
    _onClear(type) {
        switch(type) {
            case "filter":
                this.setState({
                    filterBy: ""
                });
                break;
            case "username":
                this.setState({
                    username: "",
                    usernameErr: null
                });
                Store.dispatch({
                    type: 'CLEAR_REPOS'
                });
                break;
            default:
                // Do nothing.
        }
    }
    _getReposList() {
        const { repos, filterBy } = this.state;

        if (!repos.length) {
            return (
                <li>No public repositories</li>
            );
        }

        // If some filter is applied, then filter it with filterBy value.
        let repoList = repos;

        if (filterBy) {
            repoList = repos.filter((repo, idx) => {
                return (repo.name.search(filterBy) >= 0);
                // return false;
            });
        }

        return repoList.map((repo, idx) => {
            return (
                <li key={ idx }>{ repo.name }</li>
            );
        });
    }
    _onStoreChange() {
        const { repos, error, isApiLoading } = Store.getState();

        this.setState({
            repos,
            isApiLoading,
            reposErr: error
        });
    }
    _getRepos() {
        // Check if user name is given, else show an error msg to fill username.
        if (!this.state.username) {
            this.setState({
                usernameErr: "Please enter username to continue"
            });
            return;
        } else {
            this.setState({
                usernameErr: null
            });
        }

        // Create an action to get repos for the given username.
        Actions.getRepos(this.state.username);
    }
    constructor(props) {
        super(props);

        const { repos, error, isApiLoading } =  Store.getState();

        this.state = {
            username: "",
            filterBy: "",
            usernameErr: null,
            repos,
            reposErr: error,
            isApiLoading
        };

        this.unSubscribe = null;

        // Binding `this` context to class methods.
        this._getRepos = this._getRepos.bind(this);
        this._onStoreChange = this._onStoreChange.bind(this);
        this._getReposList = this._getReposList.bind(this);
        this._onClear = this._onClear.bind(this);
    }
    render() {
        const { username, filterBy, usernameErr, isApiLoading, reposErr } = this.state;

        return (
            <section className="container">
                <header>
                    <div className="name_cont">
                        <input
                            type="text"
                            value={ username }
                            onChange={ (ev) => this.setState({ username: ev.target.value }) }
                            placeholder="Enter user name Eg: muralimano28"
                        />
                        <button
                            className="green"
                            onClick={ this._getRepos }
                        >Go</button>
                        <button
                            className="red"
                            onClick={ () => this._onClear("username") }
                        >Clear</button>
                        <div className="errormsg_cont">
                            <p className="error">{ usernameErr }</p>
                        </div>
                    </div>
                    <div className="filter_cont">
                        <input
                            type="text"
                            value={ filterBy }
                            onChange={ (ev) => this.setState({ filterBy: ev.target.value }) }
                            placeholder="Enter some keywords to filter Eg: algo"
                        />
                        <button
                            className="red"
                            onClick={ () => this._onClear("filter") }
                        >Clear</button>
                    </div>
                </header>
                <div className="repo_cont">
                    <ul className="noul">
                        {
                            (isApiLoading) ? (
                                <li>Loading...</li>
                            ) : (
                                (reposErr) ? (
                                    <li className="error">{ reposErr }</li>
                                ) : this._getReposList()
                            )
                        }
                    </ul>
                </div>
            </section>
        );
    }
    componentDidMount() {
        this.unSubscribe = Store.subscribe(this._onStoreChange);
    }
    componentWillUnmount() {
        this.unSubscribe();
    }
}
