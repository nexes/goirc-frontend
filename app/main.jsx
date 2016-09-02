import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import {Login} from './component/login';
import {App} from './component/app';

const elem = document.getElementById('app');

class Main extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Login}/>
                <Route path="/irc" component={App}/>
            </Router>
        );
    }
}

ReactDOM.render(<Main />, elem);
