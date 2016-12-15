import React from 'react';


export class ChatInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: ''
        };
        this.updateUserInput = this.updateUserInput.bind(this);
        this.submitUserInput = this.submitUserInput.bind(this);
    }


    updateUserInput(e) {
        this.setState({ input: e.target.value });
    }

    submitUserInput() {
        this.props.inputSubmit(this.state.input);
        this.setState({ input: '' });
    }


    render() {
        return (
            <div className="chat-input">
                <span className="input-name well well-sm">Server:</span>
                <input type="text" className="input-msg" placeholder="message" value={this.state.input} onChange={this.updateUserInput} />
                <button className="input-send btn btn-primary" onClick={this.submitUserInput}>Send</button>
            </div>
        );
    }
}
