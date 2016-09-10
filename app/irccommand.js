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
                body: JSON.stringify(payload)

            }).then((response) => {
                if (response.ok) {
                    //change to json when server is working
                    return response.text(); 
                }

            }).then ((json) => {
                //let res = JSON.parse(json);
                //check resonse for OK
                console.log(json);
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
        console.log('socketMessage ', event.data);
    }

    openConnection() {
        if (this.ws === undefined) {
             this.ws = new WebSocket('ws://localhost:8080/api/irc/connect');
        }
        console.log(this.ws);
        this.ws.onopen = this.socketOpen;
        this.ws.onmessage = this.socketMessage;
    }
}
