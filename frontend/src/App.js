import React from 'react'
import './App.css';
import {Redirect, Route, Switch} from "react-router";
import Auth from "./panels/Auth/Auth";
import Main from "./panels/Main/Main";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import Briefcase from "./panels/Briefcase/Briefcase";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: null,
            loading: true
        }
    }
    render() {
        return <Switch>
            <Route exact path='/'>
                <Main
                    user={this.state.user}
                />
            </Route>
            <Route exact path='/auth'>
                {!this.state.loading && this.state.token ? <Redirect to="/briefcase"/> :
                    <Auth/>
                }
            </Route>
            <PrivateRoute exact path={'/briefcase'} tokenLoading={this.state.loading}
                          token={this.state.token}>
                <Briefcase/>
            </PrivateRoute>
        </Switch>
    }
}

export default App;
