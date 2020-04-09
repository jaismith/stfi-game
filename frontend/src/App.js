import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import axios from "axios";

import Register from "./Register";
import Menu from "./Menu";
import Lobby from "./Lobby";
import Game from "./Game";

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

  componentDidMount() {
    if(!this.state.registered) {
      this.router.history.push("/register")
    }
  }

  render() {
    return (
      <div className="App">
        <Router ref={ref => this.router = ref}>
          <Switch>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/:gameID/lobby">
              <Lobby />
            </Route>
            <Route path="/:gameID">
              <Game />
            </Route>
            <Route path="/"> 
              <Menu />
            </Route>
          </Switch>
          <div className="Menu">
            <Link to="/">Return to Menu</Link>
          </div>
        </Router>
        <div className="Github">
          <a href="https://github.com/jaismith/stfi-game">Source Code</a>
        </div>
      </div>
    )
  }
}
