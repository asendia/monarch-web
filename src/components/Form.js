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
import styles from './Form.styles';
import debounce from 'debounce';
import EmailsInput, { createEmailOption } from './EmailsInput';

class Form extends React.Component {
  state = {
    form: {
      emails: [],
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
    validation: {
      emails: '',
      message: '',
    },
    isLoading: false,
  }
  saveToSessionStorage = debounce(() => {
    if (!window.sessionStorage) {
      return;
    }
    window.sessionStorage.setItem('cloudtestament.form', JSON.stringify(this.state.form));
  }, 500)
  loadFromSessionStorage = () => {
    if (!window.sessionStorage) {
      return;
    }
    try {
      const formRaw = window.sessionStorage.getItem('cloudtestament.form');
      const form = JSON.parse(formRaw);
      if (form !== null && form !== undefined) {
        this.setState({ form });
      }
    }
    catch (err) {
      window.sessionStorage.removeItem('cloudtestament.form');
    }
  }
  handleChangeValue = (key, value) => {
    this.setState({
      form: {
        ...this.state.form,
        [key]: value,
      },
    });
  }
  handleChangeText = (key) => (event) => {
    this.handleChangeValue(key, event.target.value);
    if (key === 'message') {
      this.setState({
        validation: {
          ...this.state.validation,
          message: `${event.target.value.length}/800`,
          messageError: !validateMessage(event.target.value)
        },
      });
    }
    this.saveToSessionStorage();
  }
  handleChangeSelect = (key) => (event) => {
    this.handleChangeValue(key, parseInt(event.target.value, 10));
    this.saveToSessionStorage();
  }
  // Cron activation
  handleActivationToggle = (event) => {
    if (!this.props.netlifyIdentity.currentUser()) {
      return this.openDialogInviteRegister();
    }
    this.setState({
      form: {
        ...this.state.form,
        isActive: event.target.checked,
      },
    });
    this.saveToSessionStorage();
  }
  handleEmailsChange = (emails) => {
    this.setState({
      form: {
        ...this.state.form,
        emails,
      },
      validation: {
        ...this.state.validation,
        ...this.generateEmailsValidation(emails),
      },
    });
    this.saveToSessionStorage();
  }
  generateEmailsValidation = (emails = this.state.form.emails) => {
    const emailsError = emails.length === 0 || emails.length > 3;
    return {
      emails: `${emails.length}/3 emails${emailsError ? ', please specify at least 1 email' : ''}`,
      emailsError,
    };
  }
  handleSubmit = async (event) => {
    event.preventDefault();

    const emails = this.state.form.emails;
    const message = this.state.form.message.trim().replace(/\n\s*\n\s*\n/g, '\n\n');
    const isMessageValid = validateMessage(message);
    this.setState({
      validation: {
        ...this.generateEmailsValidation(),
        message: isMessageValid ?
          `${message.length}/800` :
          `${message.length}/800, message is too ${message.length < 10 ? 'short' : 'long'}`,
        messageError: !isMessageValid,
      },
    });
  
    this.setState({
      form: {
        ...this.state.form,
        message,
      },
    });
    this.saveToSessionStorage();
  
    if (!this.props.netlifyIdentity.currentUser()) {
      return this.openDialogInviteRegister();
    }
    if (this.state.validation.emailsError || !isMessageValid) {
      return;
    }

    // Submit form
    try {
      const headers = await generateHeaders(this.props.netlifyIdentity);
      this.setState({ isLoading: true });
      await axios.post(
        'https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/initiate',
        {
          ...this.state.form,
          emails: emails.map(email => email.value).join(', '),
        },
        { headers },
      );
      this.openDialogAfterSubmit();
    } catch (err) {
      console.error(err);
    }
    this.setState({ isLoading: false });
  }
  handleCloseDialog = () => {
    this.setState({ dialog: { title: '', open: false } });
  }
  openDialogInviteRegister = () => {
    this.saveToSessionStorage();
    this.setState({
      dialog: {
        open: true,
        title: 'Please login',
        description: 'You must login first in order to try cloudtestament',
      },
    })
  }
  openDialogAfterSubmit = () => {
    const message = this.state.form.isActive ?
      ' and ACTIVATED' :
      ' but NOT YET ACTIVE. Check the activation toggle and click submit to activate';
    this.setState({
      dialog: {
        open: true,
        title: 'Submission complete',
        description: 'Your testament has been submitted' + message,
      },
    })
  }
  async componentDidMount() {
    if (!this.props.netlifyIdentity.currentUser()) {
      this.loadFromSessionStorage();
      return;
    }
    try {
      const headers = await generateHeaders(this.props.netlifyIdentity);
      const res = await axios.get(
        'https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/retrieve',
        { headers },
      );
      this.setState({
        form: {
          ...res.data,
          emails: res.data.emails.split(', ').map(createEmailOption),
        },
      });
    } catch (err) {
      this.sessionStorage.clear();
    }
  }
  render() {
    const { classes } = this.props;
    let email = 'your email';
    try {
      email = this.props.netlifyIdentity.currentUser().email;
    } catch (err) {}
    return (
      <form className={classes.container} onSubmit={this.handleSubmit}>
        <FormControl className={classes.formControl}>
          <EmailsInput
            id='emails'
            value={this.state.form.emails}
            onChange={this.handleEmailsChange}
            error={this.state.validation.emailsError}
            helperText={this.state.validation.emails}
          />
          <FormHelperText error={this.state.validation.emailsError}>{this.state.validation.emails || 'e.g. john@doe.com, ainz@gmail.com'}</FormHelperText>
        </FormControl>
        <TextField
          id='message'
          label='Testament message'
          autoComplete='off'
          className={classes.textField}
          value={this.state.form.message}
          error={this.state.validation.messageError}
          helperText={this.state.validation.message}
          onChange={this.handleChangeText('message')}
          multiline
          rowsMax='20'
          margin='normal'
        />
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor='input-silent-period'>
            Inactive period
          </InputLabel>
          <NativeSelect
            className={classes.selectEmpty}
            value={this.state.form.silentPeriod}
            name='input-silent-period'
            onChange={this.handleChangeSelect('silentPeriod')}
          >
            <option value={90}>After 3 months</option>
            <option value={180}>After 6 months</option>
            <option value={360}>After 12 months</option>
          </NativeSelect>
          <FormHelperText>Total inactive time until your message is sent to receivers' emails</FormHelperText>
        </FormControl>
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor='input-reminder-interval'>
            Reminder interval
          </InputLabel>
          <NativeSelect
            className={classes.selectEmpty}
            value={this.state.form.reminderInterval}
            name='input-reminder-interval'
            onChange={this.handleChangeSelect('reminderInterval')}
          >
            <option value={15}>Every 15 days</option>
            <option value={30}>Every 30 days</option>
          </NativeSelect>
          <FormHelperText>Time interval in which refresh link will be sent to <b>{email}</b>. If reset link is visited, inactive period will reset</FormHelperText>
        </FormControl>
        <FormControlLabel
          control={
            <Switch
              checked={this.state.form.isActive}
              onChange={this.handleActivationToggle}
              value=''
              color='primary'
            />
          }
          className={classes.switch}
          label='Enable this testament'
        />
        <Button
          onClick={this.handleSubmit}
          variant='contained'
          color='primary'
          className={classes.button}
          disabled={this.state.isLoading}
        >
          submit
        </Button>
        <DialogBox
          dialog={this.state.dialog}
          onClose={this.handleCloseDialog}
          onOk={this.state.dialog.handleOk} />
      </form>
    );
  }
}

export default withStyles(styles)(Form);

function validateMessage(message) {
  return message.length >= 10 && message.length <= 800;
}
