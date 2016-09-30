import React from 'react';
import {ChannelTab} from './channeltab';
import {ChatInput} from './chatinput';
import {ChatOutput} from './chatoutput';
import {NickList} from './nicklist';


export class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //array of objects representing irc messages
            messages: [{
                channel: '',
                nick: '',
                msg: ''
            }],
            //array of channel names: string
            channels: []
        };
        this.irc = this.props.route.irc;
        this.ircMessageUpdate = this.ircMessageUpdate.bind(this);
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
            msg: ji.MSG || ji.MOTD || 'what'
        };

        //dont need to render an array everytime, just one message elem ???
        this.setState({messages: this.state.messages.concat(msg)});
    }

    render() {
        return (
            <div>
                <ChannelTab channels={this.state.channels}/>
                <ChatOutput messages={this.state.messages}/>
                <ChatInput sendInput={this.irc.sendCommand}/>
                <NickList />
            </div>
        );
    }
}
