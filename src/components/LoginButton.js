import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  button: {
    margin: theme.spacing.unit,
    marginTop: '15px',
  },
});

class LoginButton extends React.Component {
  state = {
    isLoading: false,
  }
  handleLogin = () => {
    this.props.netlifyIdentity.open('login');
  }
  handleLogout = () => {
    this.props.netlifyIdentity.logout();
  }
  render() {
    const { classes, isLoading, user } = this.props;
    return (
      user ?
      <Button 
        onClick={this.handleLogout}
        variant='contained'
        color='secondary'
        className={classes.button}
        disabled={isLoading}
      >
        logout
      </Button> :
      <Button 
        onClick={this.handleLogin}
        variant='contained'
        color='primary'
        className={classes.button}
        disabled={isLoading}
      >
        login
      </Button>
    );
  }
}

export default withStyles(styles)(LoginButton);
