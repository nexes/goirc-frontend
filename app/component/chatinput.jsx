import React from 'react';

export class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        
        //dont need this to be state? dont need to cause a render call
        this.command = '';
        this.userInput = this.userInput.bind(this);
    }

    userInput(e) {
        this.command = e.target.value;
        console.log(this.command);
    }

    render() {
        return (
            <div className="chat-input">
                <span className="input-name well well-sm">Server:</span>
                <input type="text" className="input-msg" placeholder="message" onChange={this.userInput}/>
                <button className="input-send btn btn-primary" onClick={this.props.sendInput}>Send</button>
            </div>
        );
    }
}