import React from 'react';
import { ChannelTab } from './channeltab';
import { ChatInput } from './chatinput';
import { ChatOutput } from './chatoutput';
import { NickList } from './nicklist';


export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            messages: [{
                channel: '',
                nick: '',
                message: ''
            }],
            activeChannel: '',
            channels: [],
            userInput: ''
        };

        this.irc = this.props.route.irc;
        this.ircMessageUpdate = this.ircMessageUpdate.bind(this);
        this.sendUserInput = this.sendUserInput.bind(this);
        this.updateChannels = this.updateChannels.bind(this);
    }

    componentDidMount() {
        //setup the websocket onmessage event, needs to wait after the component loads
        this.irc.setSocketMessageEvent(this.ircMessageUpdate);
    }

    updateChannels(command, name) {
        let newChannels = this.state.channels.slice();

        if (command === 'join') {
            if (!newChannels.includes(name)) {
                this.setState({
                    channels: newChannels.concat(name),
                    activeChannel: name
                });
            }

        } else if (command == 'part') {
            let index = newChannels.indexOf(name);
            if (index === -1)
                return;

            newChannels.slice(index, 1);
            this.setState({channels: newChannels});
        }
    }

    ircMessageUpdate(event) {
        let ji = JSON.parse(event.data);
        //needs to be better/done right
        let msg = {
            channel: ji.Channel || 'Server',
            nick: ji.Nick || '',
            message: ji.MSG || ji.MOTD || 'what'
        };

        this.setState({ messages: this.state.messages.concat(msg) });
    }

    sendUserInput(input) {
        if (input !== '') {
            let cmdInput = input.trim();
            let cmd = 'write';
            let data = cmdInput;

            //if the user is sending a command
            if (cmdInput[0] === '/') {
                cmd = cmdInput.substring(1, cmdInput.indexOf(' ')).toLowerCase();
                data = cmdInput.substring(cmd.length + 2);

                if (cmd === 'join' || cmd === 'part')
                    this.updateChannels(cmd, data);
            }

            //need to get the active channel from channeltab element
            this.irc.sendCommand({
                command: cmd,
                info: data,
                channel: this.activeChannel
            });
        }
    }

    render() {
        return (
            <div>
                <ChannelTab channels={this.state.channels} />
                <ChatOutput messages={this.state.messages} />
                <ChatInput inputData={this.state.userInput} inputSubmit={this.sendUserInput} />
                <NickList />
            </div>
        );
    }
}
