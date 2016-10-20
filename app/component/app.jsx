import React from 'react';
import {ChannelTab} from './channeltab';
import {ChatInput} from './chatinput';
import {ChatOutput} from './chatoutput';
import {NickList} from './nicklist';


export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [{
                channel: '',
                nick: '',
                message: ''
            }],

            channels: [],
            userInput: ''
        };
        this.irc = this.props.route.irc;
        this.ircMessageUpdate = this.ircMessageUpdate.bind(this);
        this.sendUserInput = this.sendUserInput.bind(this);
    }

    componentDidMount() {
        //setup the websocket onmessage event, needs to wait after the component loads
        this.irc.setSocketMessageEvent(this.ircMessageUpdate);
    }

    ircMessageUpdate(event) {
        let ji = JSON.parse(event.data);
        //needs to be better/done right
        let msg = {
            channel: ji.Channel || 'Server',
            nick: ji.Nick || '',
            message: ji.MSG || ji.MOTD || 'what'
        };

        this.setState({messages: this.state.messages.concat(msg)});
    }

    sendUserInput(command) {
        this.irc.sendCommand(command);
    }

    render() {
        return (
            <div>
                <ChannelTab channels={this.state.channels}/>
                <ChatOutput messages={this.state.messages}/>
                <ChatInput inputData={this.state.userInput} inputSubmit={this.sendUserInput}/>
                <NickList />
            </div>
        );
    }
}
