import React from 'react';


export class ChatOutput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let messages = this.props.messages.map((item, index) => {
            return (
                <div className="msg" key={index}>
                    <ChatMessage channel={item.channel} message={item.message} />
                </div>
            );
        });

        return (
            <div className="chat-output">
                {messages}
            </div>
        );
    }
}

class ChatMessage extends React.Component {
    constructor(props) {
        super(props);

        //doesn't need to be state, wont update this, just need to store for shouldComponentUpdate
        this.data = {
            channel: '',
            message: ''
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(this.data.channel === nextProps.channel && this.data.message === nextProps.message);
    }

    render() {
        this.data.channel = this.props.channel;
        this.data.message = this.props.message;

        return (
            <div className="msg">
                <div className="nick">{this.props.channel}</div>
                <div className="message">{this.props.message}</div>
            </div>
        );
    }
}