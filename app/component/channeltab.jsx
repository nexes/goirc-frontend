import React from 'react';


export class ChannelTab extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="channel-tab">
                <ul>
                    <li className="active"><a href="#">Server</a></li>
                    <li><a href="#">#programming</a></li>
                    <li><a href="#">#go-nuts</a></li>
                    <li><a href="#">#go-nuts</a></li>
                </ul>
                <div className="tag">
                    <span>goIRC</span>
                </div>
            </div>
        );
    }
}