import React from 'react';

export class NickList extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextprops, nextstate) {
        return nextprops.nicks !== this.props.nicks;
    }

    render() {
        let nickList;
        
        if (this.props.nicks) {
            let sortedList = this.props.nicks.sort();
            nickList = sortedList.map((val, index) => {
                return <li key={index}>{val}</li>
            });
        }
        
        return (
            <ul className="nick-list">
                {nickList}
            </ul>
        );
    }
}
