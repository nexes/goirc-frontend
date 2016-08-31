import React from 'react';
import {ChannelTab} from './channeltab';
import {ChatInput} from './chatinput';
import {ChatOutput} from './chatoutput';
import {NickList} from './nicklist';

export class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ChannelTab />
                <ChatInput />
                <ChatOutput />
                <NickList />
            </div>
        );
    }
}