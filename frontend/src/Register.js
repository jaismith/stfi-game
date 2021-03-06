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

    register() {
        console.log("Registering user with API")

        axios.post('https://stfi-game.uk.r.appspot.com/api/devices', { params: {
            name: this.nameField.value
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
            <div className="Page">
                <h2>Create Player</h2>
                <Form onSubmit={(e) => { e.preventDefault(); this.register() }}>
                    <Form.Group controlId="registerName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="name"
                            ref={ref => this.nameField = ref}/>
                        <Form.Text className="text-muted">
                        A random name will be generated if none is provided.
                        </Form.Text>
                    </Form.Group>
                    <Button
                        variant="primary"
                        type="button"
                        onClick={() => this.register()}>
                        Register
                    </Button>
                </Form>
            </div>
        )
    }
}

export default withRouter(Register)
