import React from 'react';
import './Lobby.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class Lobby extends React.Component {
    constructor(props) {
        super(props)

        this.start = this.start.bind(this)
        this.leave = this.leave.bind(this)

        this.state = {
            game: null,
            owner: false
        }
    }

    update() {
        console.log("Fetching game data")

        axios.get(`https://stfi-game.uk.r.appspot.com/api/game/${this.props.match.params.gameID}`)
            .then(res => {
                if(res.status !== 200) {
                    this.setState({failed: true})
                    return
                }

                this.setState({game: res.data})

                console.log("Received: " + this.state.game)
            })
    }

    start() {
        console.log("Starting game")

        axios.get(`https://stfi-game.uk.r.appspot.com/api/game/${this.props.match.params.gameID}/start`)
            .then(res => {
                if(res.status !== 200) {
                    this.setState({failed: true})
                    return
                }

                this.props.history.push("/")
            })
    }

    leave(e) {
        e.preventDefault()

        console.log("Leaving game")

        this.props.history.push("/")
    }

    render() {
        return(
            <div className="Lobby">
                <h3>
                    LOBBY: {this.state.gameID}
                </h3>
                <Button variant="primary" type="button" onClick={() => this.start()}>
                    Start
                </Button>
            </div>
        )
    }
}

export default withRouter(Lobby)
