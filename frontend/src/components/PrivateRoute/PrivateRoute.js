import React from "react";
import {Redirect, Route} from "react-router";
class PrivateRoute extends React.Component {
    render() {
        return this.props.tokenLoading ? <div></div> : <Route {...this.props}>
            {
                !this.props.token ? <Redirect to="/auth" /> :
                  <>
                    {this.props.children}
                  </>
              }
        </Route>
    }
}
export default PrivateRoute