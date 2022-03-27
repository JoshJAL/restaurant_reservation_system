import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import NewTable from "./NewTable";
import New from "./New";
import Search from "../search/Search";
import Seat from "./seat/Seat";
import EditReservation from "./EditReservation";

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
      <Route path={["/", "/reservations"]}exact  >
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard/:id?" exact>
        <Dashboard />
      </Route>
      <Route path="/reservations/new" exact>
        <New />
      </Route>
      <Route path="/tables/new" exact>
        <NewTable />
      </Route>
      <Route path="/search" exact>
        <Search />
      </Route>
      <Route path="/reservations/:reservation_id/seat" exact>
        <Seat />
      </Route>
			<Route path="/reservations/:reservation_id/edit" exact>
        <EditReservation />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
