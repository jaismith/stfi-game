import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import axios from "axios";

import Register from "./Register";
import Menu from "./Menu";
import Lobby from "./Lobby";

export default class App extends React.Component {
  constructor(props) {
    super(props)

    let uuid = localStorage.getItem("uuid")
    if(uuid != null) {
      axios.defaults.headers.common['device'] = uuid
    }

    this.state = {
      registered: uuid != null
    }
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/:gameID/lobby">
              <Lobby />
            </Route>
            <Route path="/">
              <Redirect to={this.state.registered ? "/" : "/register"} /> 
              <Menu />
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
}