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
        this.ws = new IRC();
    }

    sendLoginData(nick, server, pass = '') {
        this.ws.sendLoginInfo(nick, server, pass)
            .then((res) => {
                if (res.ok) {
                    //this will be .json soon
                    res.text().then((data) => {
                        this.ws.openConnection();
                        browserHistory.push('/irc');
                    });
                } else {
                    console.log('error with fetch respons');
                }
            });
    }

    render() {
        return (
            <Router history={browserHistory}>
                <Route path="/" component={Login} loginfunc={this.sendLoginData}/>
                <Route path="/irc" component={App} irc={this.ws}/>
            </Router>
        );
    }
}

ReactDOM.render(<Main />, elem);
