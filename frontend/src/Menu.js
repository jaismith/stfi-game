import React from 'react';
import './Menu.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class Menu extends React.Component {
    constructor(props) {
        super(props)
    }

    join() {
        let pin = this.joinField.value
        if(pin.length != 6) {
            console.log("Invalid PIN: " + pin)
            return
        }
        console.log("Joining game with PIN " + pin)

        axios.get(`https://stfi-game.uk.r.appspot.com/api/games/${pin}/join`).then(res => {
            if(res.status === 200) {
                console.log("Successfully joined game")

                let gameID = res.data.id

                this.props.history.push(`/${gameID}/lobby`)
            } else {
                // TODO: fail state
            }
        })
    }

    create(e) {
        e.preventDefault()

        console.log("Creating new game")

        axios.post("https://stfi-game.uk.r.appspot.com/api/games").then(res => {
            if(res.status === 200) {
                console.log("Successfully created game")

                let gameID = res.data.id

                this.props.history.push(`/${gameID}/lobby`)
            } else {
                // TODO: fail state
            }
        })
    }

    render() {
        return(
            <div className="Menu">
                <h2 className="Title">
                    Join Existing Game
                </h2>
                <Form>
                    <Form.Group controlId="joinMenu">
                        <Form.Label>Game PIN</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="PIN"
                            ref={ref => this.joinField = ref}/>
                        <Form.Text className="text-muted">
                        This is a six digit number provided by your host.
                        </Form.Text>
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="button"
                        onClick={() => this.join()}>
                        Join
                    </Button>
                </Form>
                <h2 className="Title">
                    Create New Game
                </h2>
                <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => this.create(e)}>
                    Create
                </Button>
            </div>
        )
    }
}

export default withRouter(Menu)