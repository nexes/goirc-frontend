import React from 'react';


export class ChatInput extends React.Component {
    constructor(props) {
        super(props);
        
        //hold user input
        this.state = {
            command: ''
        };
        this.updateUserInput = this.updateUserInput.bind(this);
        this.submitUserInput = this.submitUserInput.bind(this);
    }

    updateUserInput(e) {
        this.setState({command: e.target.value});
    }

    submitUserInput(event) {
        if (this.state.command !== '') {
            this.props.sendInput(this.state.command);
            this.setState({command: ''});
        }
    }

    render() {
        return (
            <div className="chat-input">
                <span className="input-name well well-sm">Server:</span>
                <input type="text" className="input-msg" placeholder="message" value={this.state.command} onChange={this.updateUserInput}/>
                <button className="input-send btn btn-primary" onClick={this.submitUserInput}>Send</button>
            </div>
        );
    }
}
