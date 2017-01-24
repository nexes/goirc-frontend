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
            channels: new Map(), //[name:string, nicks:array[string]]
            activeChannel: '',
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
        let newChannels = new Map(this.state.channels);
        let channel = name;

        if (command === 'join') {
            if (!newChannels.has(name)) {
                newChannels.set(name, []);

                this.setState({
                    channels: newChannels,
                    activeChannel: name
                });
            }

        } else if (command === 'part') {
            let newChannels = new Map(this.state.channels);

            if (newChannels.delete(name)) {
                this.setState({
                    channels: newChannels,
                    activeChannel: '' //update this
                });
            }
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
                let newChannels = new Map(this.state.channels);

                for (let [key, val] of newChannels) {
                    if (ircMsg.NewName.includes(key)) {
                        newChannels.delete(key);
                        newChannels.set(ircMsg.NewName, []); //this isn't the best way to do it!

                        this.setState({
                            channels: newChannels,
                            activeChannel: val
                        });
                    }
                }
                break;

            case 'RPL_NAMEPLY':
                //capture the nicklist of the channel
                let channels = new Map(this.state.channels);

                if (channels.has(ircMsg.Channel)) {
                    let nicks = channels.get(ircMsg.Channel);
                    let updated_nick = nicks.concat(ircMsg.Nicks);

                    channels.set(ircMsg.Channel, updated_nick);

                    this.setState({
                        channels: channels
                    });
                }
                break;

            case 'RPL_NICKJOIN':
                let channels_join = new Map(this.state.channels);

                if (channels_join.has(ircMsg.Channel)) {
                    let nicks = channels_join.get(ircMsg.Channel);

                    nick.push(ircMsg.Nick);
                    channels_join.set(ircMsg.Channel, nicks);

                    console.log('nick join ' + ircMsg.Nick);
                    this.setState({
                        channels: channels_join
                    });
                }
                break;

            case 'RPL_NICKQUIT':
                let channels_quit = new Map(this.state.channels);

                if (channels_quit.has(ircMsg.Channel)) {
                    let nicks = channels_quit.get(ircMsg.Channel);

                    nicks.splice(nicks.indexOf(ircMsg.Nick), 1);
                    channels_quit.set(ircMsg.Channel, nicks);

                    console.log('nick quit: ' + ircMsg.Nick);
                    this.setState({
                        channels: channels_quit
                    });
                }
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
            let cmd = 'write';
            let data = cmdInput;

            //if the user is sending a command
            if (cmdInput[0] === '/') {
                cmd = cmdInput.substring(1, cmdInput.indexOf(' ')).toLowerCase();
                data = cmdInput.substring(cmd.length + 2);

                //as of right now only join and part commans are supported
                if (cmd === 'join' || cmd === 'part') {
                    this.updateChannels(cmd, data);
                    this.irc.sendCommand({
                        command: cmd,
                        data: '',
                        channel: data
                    });
                }

            } else {
                //need to get the active channel from channeltab element
                let msg = {
                    channel: this.state.activeChannel,
                    nick: this.irc.nick,
                    message: data
                };

                this.setState({ messages: this.state.messages.concat(msg) });
                this.irc.sendCommand({
                    command: cmd,
                    data: data,
                    channel: this.state.activeChannel
                });
            }
        }
    }

    render() {
        let nickList = this.state.channels.get(this.state.activeChannel);

        return (
            <div>
                <ChannelTab channels={this.state.channels} updateChannel={this.updateActiveChannel} />
                <ChatOutput messages={this.state.messages} />
                <ChatInput inputData={this.state.userInput} inputSubmit={this.sendUserInput} activeChannel={this.state.activeChannel} />
                <NickList nicks={nickList} />
            </div>
        );
    }
}
