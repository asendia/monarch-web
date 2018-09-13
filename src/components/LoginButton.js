import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import oc from '../OptionalChaining';

const styles = (theme) => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '10px 0',
  },
  greetings: {
    marginRight: '10px',
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
    const text = oc(user, 'user_metadata.full_name') || oc(user, 'email') || 'User';
    return (
      <div className={classes.wrapper}>
      {
      user ?
        <React.Fragment>
          <div className={classes.greetings}>Hello, {text}</div>
          <Button 
            onClick={this.handleLogout}
            variant='contained'
            color='secondary'
            disabled={isLoading}
          >
            logout
          </Button>
        </React.Fragment> :
        <Button 
          onClick={this.handleLogin}
          variant='contained'
          color='primary'
          disabled={isLoading}
        >
          login
        </Button>
      }
      </div>
    );
  }
}

export default withStyles(styles)(LoginButton);
