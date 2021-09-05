import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Developers from "../developers/Developers";
import Dashboard from "../dashboard/Dashboard";
import Upload from "../uploads/Upload";
import Unlock from "../unlock/Unlock";
import NotFound from "../layout/NotFound";
import PrivateRoute from "../routing/PrivateRoute";
const Routes = () => {
    return (
        <section className="container">
            <Switch>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/developers" component={Developers} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/upload" component={Upload} />
                <PrivateRoute exact path="/unlock" component={Unlock} />
                <Route component={NotFound} />
            </Switch>
        </section>
    );

};
export default Routes;