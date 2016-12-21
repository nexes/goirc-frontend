import React from 'react';


export class ChatInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            input: ''
        };
        this.updateUserInput = this.updateUserInput.bind(this);
        this.submitUserInput = this.submitUserInput.bind(this);
        this.keyPressEvent = this.keyPressEvent.bind(this);
    }


    shouldComponentUpdate(nextProps, nextState) {
        return !(nextState.input === this.state.input && 
                nextProps.activeChannel === this.props.activeChannel)
    }

    keyPressEvent(e) {
        if (e.key === 'Enter') {
            this.submitUserInput();
        }
    }

    updateUserInput(e) {
        this.setState({input: e.target.value});
    }

    submitUserInput() {
        if (this.state.input !== '') {
            this.props.inputSubmit(this.state.input);
            this.setState({input: '' });
        }
    }

    render() {
        return (
            <div className="chat-input">
                <span className="input-name well well-sm">{this.props.activeChannel}</span>
                <input type="text" className="input-msg" placeholder="message" value={this.state.input} onChange={this.updateUserInput} onKeyPress={this.keyPressEvent} />
                <button className="input-send btn btn-primary" onClick={this.submitUserInput}>Send</button>
            </div>
        );
    }
}
