import React from 'react';


export class ChatOutput extends React.Component {
    constructor(props) {
        super(props);

        this.updateMessages = this.updateMessages.bind(this);
    }

    updateMessages() {
        return this.props.messages.map((item, index) => {
            return (
                <div className="msg" key={index}>
                    <div className="nick">{item.channel}</div>
                    <div className="message">{item.msg}</div>
                </div>
            );
        });
    }

    render() {
        let messages = this.updateMessages();
        
        return (
            <div className="chat-output">
                {messages}
            </div>
        );
    }
}