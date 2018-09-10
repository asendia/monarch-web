import React from 'react';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';
import { generateHeaders } from '../ApiCalls';
import DialogBox from './DialogBox';

const styles = theme => ({
  container: {
    maxWidth: '500px',
    margin: '10px auto',
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginTop: 0,
    marginBottom: 10,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    minWidth: 120,
    overflow: 'hidden',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  button: {
    margin: theme.spacing.unit,
  },
  switch: {
    margin: 'auto',
  },
});

class Forms extends React.Component {
  state = {
    forms: {
      emails: '',
      message: '',
      silentPeriod: 180,
      reminderInterval: 30,
      isActive: false,
    },
    dialog: {
      open: false,
      title: '',
      text: '',
    },
  }
  handleChange = (key) => (event) => {
    this.setState({
      forms: {
        ...this.state.forms,
        [key]: event.target.value,
      },
    });
  }
  handleActivate = (event) => {
    if (!this.props.netlifyIdentity.currentUser()) {
      return this.openDialogInviteRegister();
    }
    this.setState({
      forms: {
        ...this.state.forms,
        isActive: event.target.checked,
      },
    });
  }
  handleSubmit = async (event) => {
    event.preventDefault();

    if (!this.props.netlifyIdentity.currentUser()) {
      return this.openDialogInviteRegister();
    }
    const emails = this.state.forms.emails.replace(/ /g, '').split(',').filter(email => {
      return validateEmail(email);
    }).join(',');
    if (emails.length === 0) {
      return console.log('email invalid');
    }
    const message = this.state.forms.message.trim().replace(/\n\s*\n\s*\n/g, '\n\n');;
    if (message.length < 10 || message.length > 800) {
      return console.log(`message too ${message.length < 10 ? 'short' : 'long'}`);
    }
    this.setState({
      forms: {
        ...this.state.forms,
        emails,
        message,
      },
    });

    // Submit form
    try {
      const headers = await generateHeaders(this.props.netlifyIdentity);
      await axios.post(
        'https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/initiate',
        this.state.forms, { headers },
      );
    } catch (err) {
      console.error(err);
    }
  }
  handleCloseDialog = () => {
    this.setState({ dialog: { title: '', open: false } });
  }
  openDialogInviteRegister = () => {
    this.setState({
      dialog: {
        open: true,
        title: 'Please register',
        description: 'You must login first in order to try cloudtestament',
      },
    })
  }
  async componentDidMount() {
    if (!this.props.netlifyIdentity.currentUser()) {
      return;
    }
    try {
      const headers = await generateHeaders(this.props.netlifyIdentity);
      const res = await axios.get(
        'https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/retrieve',
        { headers },
      );
      this.setState({ forms: res.data });
    } catch (err) {
      console.error(err);
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <form className={classes.container} onSubmit={this.handleSubmit}>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.forms.isActive}
              onChange={this.handleActivate}
              value=''
              color='primary'
            />
          }
          className={classes.switch}
          label='Activate'
        />
        <TextField
          id='emails'
          label='Target emails'
          className={classes.textField}
          value={this.state.forms.emails}
          onChange={this.handleChange('emails')}
          margin='normal'
        />
        <TextField
          id='message'
          label='Message, better write it first in notepad'
          className={classes.textField}
          value={this.state.forms.message}
          onChange={this.handleChange('message')}
          multiline
          rowsMax='20'
          margin='normal'
        />
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor='input-silent-period'>
            Silent period
          </InputLabel>
          <NativeSelect
            className={classes.selectEmpty}
            value={this.state.forms.silentPeriod}
            name='input-silent-period'
            onChange={this.handleChange('silentPeriod')}
          >
            <option value={90}>After 3 months</option>
            <option value={180}>After 6 months</option>
            <option value={360}>After 12 months</option>
          </NativeSelect>
          <FormHelperText>Total time of silence until the message is sent to target emails</FormHelperText>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor='input-reminder-interval'>
            Reminder interval
          </InputLabel>
          <NativeSelect
            className={classes.selectEmpty}
            value={this.state.forms.reminderInterval}
            name='input-reminder-interval'
            onChange={this.handleChange('reminderInterval')}
          >
            <option value={15}>Every 15 days</option>
            <option value={30}>Every 30 days</option>
          </NativeSelect>
          <FormHelperText>Time interval in which an email will be sent to your email with instructions to reset your silent period</FormHelperText>
        </FormControl>
        <Button
          onClick={this.handleSubmit}
          variant='contained'
          color='primary'
          className={classes.button}
        >
          submit
        </Button>
        <DialogBox
          dialog={this.state.dialog}
          onClose={this.handleCloseDialog} />
      </form>
    );
  }
}

export default withStyles(styles)(Forms);

function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
