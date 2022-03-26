import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import NewTable from "./NewTable";
import New from "./New";
import Search from "../search/Search";
import Seat from "./seat/Seat";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard />
      </Route>
      <Route exact={true} path="/reservations/new">
        <New />
      </Route>
      <Route exact={true} path="/tables/new">
        <NewTable />
      </Route>
      <Route>
        <Search exact={true} path="/search" />
      </Route>
      <Route>
        <Seat exact={true} path="/reservations/:reservation_id/seat" />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
