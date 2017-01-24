import React from 'react';

export class NickList extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextprops, nextstate) {
        return nextprops.nicks !== this.props.nicks;
    }

    render() {
        let sortedList = [];
        
        if (this.props.nicks) {
            sortedList = this.props.nicks.sort();
        }
        
        return (
            <ul className="nick-list">
                {sortedList}
            </ul>
        );
    }
}
