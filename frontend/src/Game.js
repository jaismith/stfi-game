import React from 'react';
import './Game.css';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import Card from './Card';
import firestore from './firebase.js';

class Game extends React.Component {
    constructor(props) {
        super(props)

        this.update = this.update.bind(this)
        this.draw = this.draw.bind(this)
        this.keyPress = this.keyPress.bind(this)

        this.observer = null

        this.state = {
            game: null,
            card: null,
            drawing: false,
        }
    }

    componentDidMount() {
        this.update()

        let doc = firestore.collection('games').doc(this.props.match.params.gameID)
        this.observer = doc.onSnapshot(() => {
            console.log("Update triggered by firestore...")
            this.update()
        })

        document.addEventListener("keydown", this.keyPress, false)
    }

    componentWillUnmount() {
        this.observer()
        document.removeEventListener("keydown", this.keyPress, false)
    }

    keyPress(event) {
        if(event.keyCode === 32) {
            this.draw()
        }
    }

    update() {
        console.log("Updating...")

        axios.get(`https://stfi-game.uk.r.appspot.com/api/games/${this.props.match.params.gameID}`)
            .then(res => {
                if(res.status !== 200) {
                    console.log(res)
                }

                this.setState({
                    game: res.data,
                    card: res.data.card
                })

                if(res.data.status === "complete") {
                    this.props.history.push("/")
                }
            })
    }

    draw() {
        console.log("Drawing card...")

        this.setState({drawing: true})

        axios.get(`https://stfi-game.uk.r.appspot.com/api/games/${this.props.match.params.gameID}/draw`)
            .then(res => {
                if(res.status !== 200) {
                    console.log(res)
                }

                this.setState({
                    card: res.data.card
                })

                this.update()

                this.setState({drawing: false})
            })
    }

    render() {
        return(
            <div className="Page">
                {this.state.game != null ?
                    <div>
                        <div className="Game">
                            <div>
                                <p>PIN: {this.state.game.pin}</p>
                                <ListGroup id="players">
                                    {this.state.game.players.map(player => (
                                        <ListGroup.Item
                                            variant={player.id === localStorage.getItem('uuid') ? 'primary' : ''}
                                            active={player.id === this.state.game.sequence[this.state.game.turn]}>
                                            {player.name}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </div>
                            <div className="Cards">
                                <Card cardNum={this.state.card} />
                            </div>
                        </div>
                        <div className="Action">
                            <Button 
                                variant="primary" 
                                type="button"
                                onClick={() => this.draw()}
                                disabled={this.state.game.sequence[this.state.game.turn] !== localStorage.getItem('uuid')}>
                                Draw
                                {this.state.drawing ? 
                                    <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true" /> 
                                : null}
                            </Button>
                            <p id="spaceBarTip">(alternatively, hit the space-bar!)</p>
                        </div>
                    </div>
                :
                    <div className="LoadingState">
                        <h2>
                            Loading Game...
                        </h2>
                        <Spinner animation="border" />
                    </div>
                }
            </div>
        )
    }
}

export default withRouter(Game)
