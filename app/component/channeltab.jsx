import React from 'react';


export class ChannelTab extends React.Component {
    constructor(props) {
        super(props);

        this.tabClick = this.tabClick.bind(this);
    }

    tabClick(e) {
        let name = e.target.innerText;

        if (name !== '')
            this.props.updateChannel(name);
    }

    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.channels !== nextprops.channels;
    }

    render() {
        let list = this.props.channels.map((value, index) => {
            return <li key={index} onClick={this.tabClick}><a href="#">{value}</a></li>;
        });

        return (
            <div className="channel-tab">
                <ul>
                    {list}
                </ul>
                <div className="tag">
                    <span>goIRC</span>
                </div>
            </div>
        );
    }
}
