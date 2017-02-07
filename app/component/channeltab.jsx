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
        return !(this.props.channels === nextprops.channels &&
                 this.props.activeChannel === nextprops.activeChannel);
    }

    render() {
        let list = [];
        let index = 0;

        for (let [name, nicks] of this.props.channels) {
            list.push(<li key={index++}
                onClick={this.tabLeftClick}
                onContextMenu={this.tabRightClick}
                className={(name === this.props.activeChannel ? 'active' : 'none')}>
                <a href="#">{name}</a>
            </li>)
        }

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
