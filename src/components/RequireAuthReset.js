import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom'

export const PrivateRouteReset = ({component: ComposedComponent, ...rest}) => {

  class Authentication extends Component {
    
    // redirect if not authenticated; otherwise, return the component imputted into <PrivateRoute />
    handleRender(props) {
      if (!this.props.authenticated) {
        return <Redirect to={{
          pathname: '/sign-in',
          state: {
            from: props.location,
            message: 'You need to sign up'
          }
        }}/>
      } else {
        return <ComposedComponent {...props}/>
      }
    }

    render() {
      // console.log(this.props.authenticated)
      return (
        <Route {...rest} render={this.handleRender.bind(this)}/>
      )
    }
  }

  function mapStateToProps(state) {
    console.log(state)
    return {authenticated: state.auth.authenticatedReset};
  }

  const AuthenticationContainer = connect(mapStateToProps)(Authentication)
  return <AuthenticationContainer/>
}