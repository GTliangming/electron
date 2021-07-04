import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import Game from "./components/game/gobang"
import Menu from "./muen"
const styles = require("./index.scss");

const App = () =>
  <HashRouter>
    <div className={styles.app}>
      <Menu />
      <div className={styles.container}>
        <Switch>
          <Route path="/game" exact component={Game} />
        </Switch>
      </div>
    </div>
  </HashRouter>

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
