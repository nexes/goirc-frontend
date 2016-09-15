import React from 'react';

export class ChatInput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="chat-input">
                <span className="input-name well well-sm">Server:</span>
                <input typ="text" className="input-msg" placeholder="message"/>
                <button className="input-send btn btn-primary">Send</button>
            </div>
        );
    }
}