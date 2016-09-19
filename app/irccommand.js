//this will be the communication point to the server

export class IRC {
    constructor() {
        this.ws = undefined;
    }

    sendLoginInfo(nick, server, pass = '') {
        let payload = {
            nick: nick,
            server: server,
            pass: pass
        };

        if (window.fetch) {
            return fetch('/api/irc/connect', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            });

        } else {
            let req = new XMLHttpRequest();

            req.addEventListener('load', (e) => {
                //handle success
                this.openConnection();
                console.log('from XMLHttpRequest load', e.target.response);
            });

            req.addEventListener('error', (e) => {
                //handle errors
                console.log('from XMLHttpRequest error', e.target.response);
            });

            req.open('POST', '/api/irc/connect');
            req.send(JSON.stringify(payload));
        }
    }

    socketOpen(event) {
        console.log('socketOpen ', event);
    }

    //fnc is a function to be called when the websocket receives a message event
    //void func(event)
    setSocketMessageEvent(fnc) {
        this.ws.onmessage = fnc;
    }

    openConnection() {
        if (this.ws === undefined) {
            this.ws = new WebSocket('ws://localhost:8080/api/irc/connect');
        }
        this.ws.onopen = this.socketOpen;

    }

    sendCommand(cmd) {
    }
}
