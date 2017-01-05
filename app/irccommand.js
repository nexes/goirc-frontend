//this will be the communication point to the server

export class IRC {
    constructor() {
        this.ws = undefined;
    }

    sendLoginInfo(nick, server, pass = '') {
        this.nick = nick;
        this.password = pass;
        this.server = server;

        let payload = {
            nick: nick,
            server: server,
            pass: pass
        };

        if (window.fetch) {
            return new Promise(function(resolve, reject) {
                fetch('/api/irc/connect', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                }).then((res) => {
                    if (res.ok) {
                       res.text().then((data) => {
                            resolve(data);
                       });
                    } else {
                        reject(res.statusText);
                    }
                }).catch((error) => {
                    reject(error.message);
                });
            });

        } else {
            return new Promise(function(resolve, reject) {
                let req = new XMLHttpRequest();

                req.addEventListener('load', (e) => {
                    console.log('from xmlhttp response ', e.target.response);
                    resolve(e.target.response);
                });
                req.addEventListener('error', (e) => {
                    console.log('from xmlhttp error, ', e.target.response);
                    reject(e.target.response);
                });

                req.open('POST', '/api/irc/connect');
                req.send(JSON.stringify(payload));
            });
        }
    }

    socketOpen(event) {
        console.log('socketOpen ', event);
    }

    //fnc is a function to be called when the websocket receives a message event
    //void func(event)
    setSocketMessageEvent(fnc) {
        if (this.ws !== undefined && typeof fnc === 'function') {
            this.ws.onmessage = fnc;
        }
    }

    openConnection() {
        if (this.ws === undefined) {
            console.log('ws://' + window.location.host + '/api/irc/connect');
            this.ws = new WebSocket('ws://' + window.location.host + '/api/irc/connect')
            // this.ws = new WebSocket('ws://localhost:8080/api/irc/connect');
        }
        this.ws.onopen = this.socketOpen;
    }

    sendCommand(command) {
        this.ws.send(JSON.stringify(command));
    }
}
