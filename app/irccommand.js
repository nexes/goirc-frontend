//this will be the communication point to the server

export class IRC {
    constructor() {
        this.ws = undefined;
    }

    sendLoginInfo(nick, server, pass = 'none') {
        let payload = {
            nick: nick,
            server: server,
            pass: pass
        };

        if (window.fetch) {
            fetch('/api/irc/connect', {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })

            }).then((response) => {
                if (response.ok) {
                    //change to json when server is working
                    return response.text();
                }

            }).then ((json) => {
                let res = JSON.parse(json);
                console.log(json);
                console.log(res.response);
                this.openConnection();
            });

        } else {
            let req = new XMLHttpRequest();

            req.addEventListener('load', (e) => {
                //handle success
                this.openConnection();
                console.log('from XMLHttpRequest load');
                console.log(e.target.response);
            });

            req.addEventListener('error', (e) => {
                //handle errors
                console.log('from XMLHttpRequest error');
                console.log(e);
            });

            req.open('POST', '/api/irc/connect');
            req.send(JSON.stringify(payload));
        }
    }

    socketOpen(event) {
        console.log('socketOpen ', event.data);
    }

    socketMessage(event) {
        let data = JSON.parse(event.data);
        console.log('socketMessage ', data.MSG);
    }

    openConnection() {
        if (this.ws === undefined) {
             this.ws = new WebSocket('ws://localhost:8080/api/irc/connect');
        }
        this.ws.onopen = this.socketOpen;
        this.ws.onmessage = this.socketMessage;
    }

    sendCommand(cmd) {
    }
}
