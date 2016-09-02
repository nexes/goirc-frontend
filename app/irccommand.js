//this will be the communication point to the server

export function OpenConnection(nick, server, pass = 'none') {
    let payload = {
        nick: nick,
        server: server,
        pass: pass
    };

    if (window.fetch) {
        fetch('/api/irc/connect', {
            method: 'POST',
            body: JSON.stringify(payload)

        }).then(function(response) {
            if (response.ok) {
                return response.text(); //change to json when server is working
            }

        }).then (function(json) {
            console.log(json);
        });

    } else {
        let req = new XMLHttpRequest();

        req.addEventListener('load', (e) => {
            //handle success
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