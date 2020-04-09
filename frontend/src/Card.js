import React from 'react';
import './Card.css';

class Card extends React.Component {
    render() {
        return (
            <div className="Card">
                <img src={`/media/decks/stfi/card${this.props.cardNum}.svg`} height="100%" alt={`Card ${this.props.cardNum}`}/>
            </div>
        )
    }
}

export default Card
