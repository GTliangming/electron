import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch } from "react-router-dom";
import Game from "./components/game/gobang"
import Menu from "./muen"
import Test from "./components/test" 
import FileList from "components/file-list";
const styles = require("./index.scss");

const App = () =>
  <HashRouter>
    <div className={styles.app}>
      <Menu />
      <div className={styles.container}>
        <Switch>
          <Route path="/game" exact component={Game} />
          <Route path="/test" exact component={Test} />
          <Route path="/file-list" exact component={FileList} />
        </Switch>
      </div>
    </div>
  </HashRouter>

ReactDOM.render(
  <App />,
  document.getElementById("app")
);
