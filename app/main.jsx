import React from 'react';
import ReactDOM from 'react-dom';
import {ChannelTab} from './component/channeltab';
import {ChatInput} from './component/chatinput';
import {ChatOutput} from './component/chatoutput';
import {NickList} from './component/nicklist';

const elem = document.getElementById('app');


class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <ChannelTab />
                <ChatInput />
                <NickList />
                <ChatInput />
            </div>
        );
    }
}

ReactDOM.render(<App />, elem);