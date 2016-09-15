import React from 'react';

export class ChatOutput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="chat-output">
                <div className="msg">
                    <div className="nick">nexes</div>
                    <div className="message">hey hello world</div>
                </div>
                <div className="msg">
                    <div className="nick">Dave</div>
                    <div className="message">hey nexes, what is the ups</div>
                </div>
            </div>
        );
    }
}