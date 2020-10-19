import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import {MenuMain} from "./components/MenuMain";
import {MenuSeminars} from "./components/MenuSeminars";
import {Footer} from "./components/Footer";

import Home from "./pages/Home";
import Malynar from "./pages/Malynar";
import Matik from "./pages/Matik";
import Strom from "./pages/Strom";
import Zdruzenie from "./pages/Zdruzenie";
import Ulohy from "./pages/Ulohy";
import Archive from "./pages/Archive";

export const Webstrom: React.FC = () => {
  return (
    <Router>
      <div id="page-container">
        <MenuSeminars />
        <MenuMain />

        <div id="main-content">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/malynar/" component={Malynar} />
            <Route exact path="/matik/" component={Matik} />
            <Route exact path="/strom/" component={Strom} />
            <Route exact path="/zdruzenie/" component={Zdruzenie} />
            <Route exact path="/competitions/series/latest-problems/" component={Ulohy} />
            <Route exact path="/archive/" component={Archive} />
          </Switch>
        </div>

        <Footer />
      </div>
    </Router>
  );
}
