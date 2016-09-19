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
        this.sendUserInput = this.sendUserInput.bind(this);
    }

    componentDidMount() {
        console.log('componentDidMount called');
        this.irc.setSocketMessageEvent(this.ircMessageUpdate);
    }

    ircMessageUpdate(event) {
        let ji = JSON.parse(event.data);
        let msg = {
            channel: ji.Channel || 'Server',
            nick: ji.Nick || '',
            msg: ji.MSG || ji.MOTD || 'what'
        };

        //dont need to render an array everytime, just one message elem ???
        this.setState({messages: this.state.messages.concat(msg)});
    }

    sendUserInput(event) {
        console.log('userInput ', event)
    }

    render() {
        return (
            <div>
                <ChannelTab channels={this.state.channels}/>
                <ChatOutput messages={this.state.messages}/>
                <ChatInput sendInput={this.sendUserInput}/>
                <NickList />
            </div>
        );
    }
}
