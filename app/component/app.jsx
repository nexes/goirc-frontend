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

        //bind class functions to 'this' for es6/react reasons
        this.ircMessageUpdate = this.ircMessageUpdate.bind(this);
        this.sendUserInput = this.sendUserInput.bind(this);
        this.updateChannels = this.updateChannels.bind(this);
        this.updateActiveChannel = this.updateActiveChannel.bind(this);
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
            //update active channel
            this.setState({ channels: newChannels });
        }
    }

    updateActiveChannel(channelName) {
        if (this.state.activeChannel !== channelName)
            this.setState({ activeChannel: channelName });
    }

    //working on this function.
    ircMessageUpdate(event) {
        let ircMsg = JSON.parse(event.data);
        let msg = {};

        console.log(ircMsg);
        switch (ircMsg.IDName) {
            case 'PING':
                this.irc.sendCommand({
                    command: 'pong',
                    room: '',
                    data: ''
                });
                break;

            case 'RPL_MOTD':
                msg.channel = ircMsg.Host;
                msg.nick = '';
                msg.message = ircMsg.MOTD;

                this.setState({ messages: this.state.messages.concat(msg) });
                break;

            case 'RPL_CHANNELNAME':
                let newChannels = this.state.channels.slice();

                newChannels.forEach((value, index) => {
                    if (ircMsg.NewName.includes(value)) {
                        newChannels.slice(index, 1);
                        newChannels.push(value);

                        this.setState({
                            channels: newChannels,
                            activeChannel: value
                        });
                    }
                });
                break;

            case 'RPL_NICKJOIN':
                //TODO: update nick list for the channel given
                break;

            case 'RPL_NICKQUIT':
                //TODO: update nick list for the channel given
                break;


            case 'RPL_PRIVMSG':
                //TODO: make sure messages are shown in the correct room
                msg.channel = ircMsg.Channel;
                msg.nick = ircMsg.Nick;
                msg.message = ircMsg.MSG;

                this.setState({ messages: this.state.messages.concat(msg) });
                break;
        }
    }

    sendUserInput(input) {
        if (input.length !== 0) {
            let cmdInput = input.trim();
            //default command will be write
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
                data: data,
                channel: this.state.activeChannel
            });
        }
    }

    render() {
        return (
            <div>
                <ChannelTab channels={this.state.channels} updateChannel={this.updateActiveChannel} />
                <ChatOutput messages={this.state.messages} />
                <ChatInput inputData={this.state.userInput} inputSubmit={this.sendUserInput} />
                <NickList />
            </div>
        );
    }
}
