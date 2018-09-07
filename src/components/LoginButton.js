import React from 'react';

class LoginButton extends React.Component {
  state = {
    isLoading: false,
  };
  componentDidMount() {
    this.props.netlifyIdentity.on('login', user => {
      this.setState({ isLoading: false });
      this.props.netlifyIdentity.close();
    });
    this.props.netlifyIdentity.on('logout', () => {
      this.setState({ isLoading: false });
    });
    this.props.netlifyIdentity.on('close', () => {
      this.setState({ isLoading: false });
    });
  }
  handleRegister = () => {
    this.setState({ isLoading: true });
    this.props.netlifyIdentity.open('login');
  }
  handleLogout = () => {
    this.setState({ isLoading: true });
    this.props.netlifyIdentity.logout();
  }
  render() {
    return this.state.isLoading ?
      <button disabled>loading...</button> :
      this.props.netlifyIdentity.currentUser() ?
      <button onClick={this.handleLogout}>logout</button> :
      <button onClick={this.handleRegister}>login</button>;
  }
}

export default LoginButton;
