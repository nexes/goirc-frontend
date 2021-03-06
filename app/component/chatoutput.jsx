import React from 'react';

export class ChatOutput extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let channel = this.props.activeChannel;

        let messages = this.props.messages.map((item, index) => {
            if (item.channel === channel) {
                return (
                    <div className="msg" key={index}>
                        <ChatMessage nick={item.nick} channel={item.channel} message={item.message} />
                    </div>
                );
            }
        });

        return (
            <div className="chat-output" ref={(elm) => {if(elm) elm.scrollTop = elm.scrollHeight;}}>
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
            message: '',
            nick: '',
            time: ''
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !(this.data.channel === nextProps.channel && 
            this.data.message === nextProps.message && 
            this.data.nick === nextProps.nick);
    }

    render() {
        this.data.time = new Date().toTimeString().slice(0, 8);
        this.data.channel = this.props.channel;
        this.data.message = this.props.message;
        this.data.nick = this.props.nick;

        return (
            <div className="msg">
                <div className="time">[{this.data.time}]</div>
                <div className="nick">{this.props.nick}:</div>
                <div className="message">{this.props.message}</div>
            </div>
        );
    }
}
