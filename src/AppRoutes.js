import React, { Component } from 'react'
import {
  Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { connect } from 'react-redux'
import history from './history'
// COMPONENTS
import Home from './pages/Home'
import './App.css'

const PrivateRoute = ({component: Component, isAuthenticated, ...rest}) => {
  return (
    <Route {...rest} render={props => (
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: props.location }
        }} />
      )
    )} />
  )
}

class AppRoutes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch >
          <Route exact path="/" component={Home}></Route>
          {/* <Route exact path="/login" component={Login}></Route> */}
          {/* <PrivateRoute path="/home" component={Home} isAuthenticated={this.props.user}></PrivateRoute> */}
          {/* <Route component={ErrorPage}></Route> */}
        </Switch>
      </Router >
    )
  }
}

const mapStateToProps = ({ auth }) => {
  const { user } = auth
  return { user }
}

export default connect(mapStateToProps, {})(AppRoutes)
