import React from 'react';
import './Lobby.css';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';
import { withRouter } from "react-router-dom";
import firestore from './firebase.js';

class Lobby extends React.Component {
    constructor(props) {
        super(props)

        this.start = this.start.bind(this)
        this.leave = this.leave.bind(this)

        this.observer = null

        this.state = {
            game: null,
            owner: false
        }
    }

    componentDidMount() {
        this.update()

        let doc = firestore.collection('games').doc(this.props.match.params.gameID)
        this.observer = doc.onSnapshot(() => {
            console.log("Update triggered by firestore...")
            this.update()
        })
    }

    componentWillUnmount() {
        this.observer()
    }

    update() {
        console.log("Fetching game data")

        axios.get(`https://stfi-game.uk.r.appspot.com/api/games/${this.props.match.params.gameID}`)
            .then(res => {
                if(res.status !== 200) {
                    this.setState({failed: true})
                    return
                }

                this.setState({game: res.data})

                console.log("Received game data")

                if(this.state.game.status === "in progress") {
                    this.props.history.push(`/${this.props.match.params.gameID}`)
                }
            })
    }

    start() {
        console.log("Starting game")

        axios.get(`https://stfi-game.uk.r.appspot.com/api/games/${this.props.match.params.gameID}/start`)
            .then(res => {
                if(res.status !== 200) {
                    this.setState({failed: true})
                    return
                }

                this.props.history.push(`/${this.props.match.params.gameID}`)
            })
    }

    leave(e) {
        e.preventDefault()

        console.log("Leaving game")

        this.props.history.push("/")
    }

    render() {
        return(
            <div className="Page">
                {this.state.game != null ?
                    <div>
                        <h2 id="pin">
                            Pin: {this.state.game.pin}
                        </h2>
                        <div className="Players">
                            <h4>
                                Players:
                            </h4>
                            <ListGroup>
                                {this.state.game.players.map(player => (
                                    <ListGroup.Item
                                        variant={player.id === localStorage.getItem('uuid') ? "primary" : ""}>
                                        {player.name}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </div>
                        <Button 
                            variant="primary" 
                            type="button" 
                            onClick={() => this.start()}
                            disabled={!this.state.game.owner === localStorage.getItem('uuid')}>
                            Start
                        </Button>
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

export default withRouter(Lobby)
