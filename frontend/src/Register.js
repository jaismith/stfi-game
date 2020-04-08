import React from 'react';
import './Register.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class Register extends React.Component {
    constructor(props) {
        super(props)

        this.register = this.register.bind(this)

        this.state = {
            failed: false,
            complete: false
        }
    }

    register(e) {
        e.preventDefault()

        console.log("Registering user with API")

        axios.post('https://stfi-game.uk.r.appspot.com/api/devices', { params: {
            name: e.target.value
        }}).then(res => {
            if(res.status !== 200) {
                this.setState({failed: true})
                return
            }

            let uuid = res.data['uuid']

            console.log("Assigned ID " + uuid)
            localStorage.setItem('uuid', uuid)

            // send uuid with all future requests
            axios.defaults.headers.common['device'] = uuid

            this.props.history.push("/")
        })
    }

    render() {
        return(
            <div className="Register">
                <Form>
                <Form.Group controlId="registerName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="name"/>
                    <Form.Text className="text-muted">
                    A random name will be generated if none is provided.
                    </Form.Text>
                </Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    onClick={(e) => this.register(e)}>
                    Register
                </Button>
                </Form>
            </div>
        )
    }
}

export default withRouter(Register)
