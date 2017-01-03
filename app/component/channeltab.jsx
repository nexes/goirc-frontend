import React from 'react';


export class ChannelTab extends React.Component {
    constructor(props) {
        super(props);

        this.tabLeftClick = this.tabLeftClick.bind(this);
        this.tabRightClick = this.tabRightClick.bind(this);
    }

    tabLeftClick(e) {
        let name = e.target.innerText;
        if (name !== '')
            this.props.updateChannel(name);
    }

    tabRightClick(e) {
        //TODO: right click to do channel operations, part etc
    }

    shouldComponentUpdate(nextprops, nextstate) {
        return this.props.channels !== nextprops.channels;
    }

    render() {
        let list = this.props.channels.map((value, index) => {
            return <li key={index} onClick={this.tabLeftClick} onContextMenu={this.tabRightClick}><a href="#">{value}</a></li>;
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
