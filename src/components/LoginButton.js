import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
    marginTop: 20,
  },
});

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
  handleLogin = () => {
    this.setState({ isLoading: true });
    this.props.netlifyIdentity.open('login');
  }
  handleLogout = () => {
    this.setState({ isLoading: true });
    this.props.netlifyIdentity.logout();
  }
  render() {
    const { classes } = this.props;
    return (
      this.props.netlifyIdentity.currentUser() ?
      <Button 
        onClick={this.handleLogout}
        variant='contained'
        color='secondary'
        className={classes.button}
        disabled={this.state.isLoading}
      >
        logout
      </Button> :
      <Button 
        onClick={this.handleLogin}
        variant='contained'
        color='primary'
        className={classes.button}
        disabled={this.state.isLoading}
      >
        login
      </Button>
    );
  }
}

export default withStyles(styles)(LoginButton);
