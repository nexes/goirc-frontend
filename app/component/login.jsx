import React from 'react';


export class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            nick: '',
            pass: '',
            server: ''
        };
        this.sendLogin = this.props.route.loginfunc;
        
        this.connectToIRC = this.connectToIRC.bind(this);
        this.updateInput = this.updateInput.bind(this);
    }

    updateInput(e) {
        if (e.target.name === 'nick') {
            this.setState({ nick: e.target.value });

        } else if (e.target.name === 'pass') {
            this.setState({ pass: e.target.value });

        } else if (e.target.name === 'server') {
            this.setState({ server: e.target.value });
        }
    }

    connectToIRC(e) {
        if (this.state.nick.length === 0) {
            console.log('we should make a popup error');
            return;
        }

        if (this.state.server.length === 0) {
            console.log('we should make a popup error');
            return;
        }

        this.sendLogin(this.state.nick, this.state.server, this.state.pass);
    }

    render() {
        return (
            <div>
                <div className="height-center col-xs-6 col-xs-offset-3 col-md-6 col-md-offset-3">
                    <Title />

                    <div className="form-group">
                        <input
                            type="text"
                            name="nick"
                            className="form-control"
                            value={this.state.nick}
                            onChange={this.updateInput}
                            placeholder="Nick"/>
                        <input
                            type="text"
                            name="pass"
                            className="form-control"
                            value={this.state.pass}
                            onChange={this.updateInput}
                            placeholder="Password (optional)"/>
                        <br />
                        <input
                            type="text"
                            name="server"
                            className="form-control"
                            value={this.state.server}
                            onChange={this.updateInput}
                            placeholder="Server  e.g irc.freenode.net"/>
                    </div>
                    <button
                        type="button"
                        className="btn btn-block btn-success"
                        onClick={this.connectToIRC}>Connect</button>
                </div>

                <Footer />
            </div>
        );
    }
}

class Title extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="page-header">
                <h1>goIRC Client <small>IRC client written in Go and React.js</small></h1>
            </div>
        );
    }
}

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="footer">
                <p>By Joe Berria: joeberria@gmail.com <a href="https://github.com/nexes/goIRC">goIRC</a></p>
            </div>
        );
    }
}
