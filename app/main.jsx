import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory} from 'react-router';
import {Login} from './component/login';
import {App} from './component/app';
import {IRC} from './irccommand';


const elem = document.getElementById('app');

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.sendLoginData = this.sendLoginData.bind(this);
        this.irc = new IRC();
    }

    sendLoginData(nick, server, pass = '') {
        this.irc.sendLoginInfo(nick, server, pass)
            .then((res) => {
                this.irc.openConnection();
                browserHistory.push('/irc');
            })
            .catch((res) => {
                console.log('error from sendLoginData ', res);
            });
    }

    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Login} loginfunc={this.sendLoginData}/>
                <Route path="/irc" component={App} irc={this.irc}/>
            </Router>
        );
    }
}

ReactDOM.render(<Main />, elem);

