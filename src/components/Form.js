import React, { useState, useEffect } from 'react';
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

function Form(props) {
  const [state, setState] = useState({
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
  });
  const saveToSessionStorage = debounce(() => {
    if (!window.sessionStorage) {
      return;
    }
    window.sessionStorage.setItem('cloudtestament.form', JSON.stringify(state.form));
  }, 500);
  function loadFromSessionStorage() {
    if (!window.sessionStorage) {
      return;
    }
    try {
      const formRaw = window.sessionStorage.getItem('cloudtestament.form');
      const form = JSON.parse(formRaw);
      if (form !== null && form !== undefined) {
        setState({
          ...state,
          form,
        });
      }
    }
    catch (err) {
      window.sessionStorage.removeItem('cloudtestament.form');
    }
  }
  function handleChangeValue(key, value) {
    setState({
      ...state,
      form: {
        ...state.form,
        [key]: value,
      },
    });
  }
  const handleChangeText = (key) => (event) => {
    handleChangeValue(key, event.target.value);
    if (key === 'message') {
      setState({
        ...state,
        validation: {
          ...state.validation,
          message: `${event.target.value.length}/800`,
          messageError: !validateMessage(event.target.value),
        },
      });
    }
    saveToSessionStorage();
  }
  const handleChangeSelect = (key) => (event) => {
    handleChangeValue(key, parseInt(event.target.value, 10));
    saveToSessionStorage();
  }
  // Cron activation
  function handleActivationToggle(event) {
    if (!props.netlifyIdentity.currentUser()) {
      return openDialogInviteRegister();
    }
    setState({
      ...state,
      form: {
        ...state.form,
        isActive: event.target.checked,
      },
    });
    saveToSessionStorage();
  }
  function handleEmailsChange(emails) {
    setState({
      ...state,
      form: {
        ...state.form,
        emails,
      },
      validation: {
        ...state.validation,
        ...generateEmailsValidation(emails),
      },
    });
    saveToSessionStorage();
  }
  function generateEmailsValidation(emails = state.form.emails) {
    const emailsError = emails.length === 0 || emails.length > 3;
    return {
      emails: `${emails.length}/3 emails${emailsError ? ', please specify at least 1 email' : ''}`,
      emailsError,
    };
  }
  async function handleSubmit(event) {
    event.preventDefault();

    const emails = state.form.emails;
    const message = state.form.message.trim().replace(/\n\s*\n\s*\n/g, '\n\n');
    const isMessageValid = validateMessage(message);
    setState({
      ...state,
      validation: {
        ...generateEmailsValidation(),
        message: isMessageValid ?
          `${message.length}/800` :
          `${message.length}/800, message is too ${message.length < 10 ? 'short' : 'long'}`,
        messageError: !isMessageValid,
      },
    });
  
    setState({
      ...state,
      form: {
        ...state.form,
        message,
      },
    });
    saveToSessionStorage();
  
    if (!props.netlifyIdentity.currentUser()) {
      return openDialogInviteRegister();
    }
    if (state.validation.emailsError || !isMessageValid) {
      return;
    }

    // Submit form
    try {
      const headers = await generateHeaders(props.netlifyIdentity);
      setState({ ...state, isLoading: true });
      await axios.post(
        'https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/initiate',
        {
          ...state.form,
          emails: emails.map(email => email.value).join(', '),
        },
        { headers },
      );
      openDialogAfterSubmit();
    } catch (err) {
      console.error(err);
    }
    setState({ ...state, isLoading: false });
  }
  function handleCloseDialog() {
    setState({ ...state, dialog: { title: '', open: false } });
  }
  function openDialogInviteRegister() {
    saveToSessionStorage();
    setState({
      ...state,
      dialog: {
        open: true,
        title: 'Please login',
        description: 'You must login first in order to try cloudtestament',
      },
    })
  }
  function openDialogAfterSubmit() {
    const message = state.form.isActive ?
      ' and ACTIVATED' :
      ' but NOT YET ACTIVE. Check the activation toggle and click submit to activate';
    setState({
      ...state,
      dialog: {
        open: true,
        title: 'Submission complete',
        description: 'Your testament has been submitted' + message,
      },
    })
  }
  useEffect(async () => {
    if (!props.netlifyIdentity.currentUser()) {
      loadFromSessionStorage();
      return;
    }
    try {
      const headers = await generateHeaders(props.netlifyIdentity);
      const res = await axios.get(
        'https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/retrieve',
        { headers },
      );
      setState({
        ...state,
        form: {
          ...res.data,
          emails: res.data.emails.split(', ').map(createEmailOption),
        },
      });
    } catch (err) {
      if (window.sessionStorage) {
        window.sessionStorage.clear();
      }
    }
  }, [props.key]);

  const { classes } = props;
  let email = 'your email';
  try {
    email = props.netlifyIdentity.currentUser().email;
  } catch (err) {}
  return (
    <form className={classes.container} onSubmit={handleSubmit}>
      <FormControl className={classes.formControl}>
        <EmailsInput
          id='emails'
          value={state.form.emails}
          onChange={handleEmailsChange}
          error={state.validation.emailsError}
          helperText={state.validation.emails}
        />
        <FormHelperText error={state.validation.emailsError}>{state.validation.emails || 'e.g. john@doe.com, ainz@gmail.com'}</FormHelperText>
      </FormControl>
      <TextField
        id='message'
        label='Testament message'
        autoComplete='off'
        className={classes.textField}
        value={state.form.message}
        error={state.validation.messageError}
        helperText={state.validation.message}
        onChange={handleChangeText('message')}
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
          value={state.form.silentPeriod}
          name='input-silent-period'
          onChange={handleChangeSelect('silentPeriod')}
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
          value={state.form.reminderInterval}
          name='input-reminder-interval'
          onChange={handleChangeSelect('reminderInterval')}
        >
          <option value={15}>Every 15 days</option>
          <option value={30}>Every 30 days</option>
        </NativeSelect>
        <FormHelperText>Time interval in which refresh link will be sent to <b>{email}</b>. If reset link is visited, inactive period will reset</FormHelperText>
      </FormControl>
      <FormControlLabel
        control={
          <Switch
            checked={state.form.isActive}
            onChange={handleActivationToggle}
            value=''
            color='primary'
          />
        }
        className={classes.switch}
        label='Enable this testament'
      />
      <Button
        onClick={handleSubmit}
        variant='contained'
        color='primary'
        className={classes.button}
        disabled={state.isLoading}
      >
        submit
      </Button>
      <DialogBox
        dialog={state.dialog}
        onClose={handleCloseDialog}
        onOk={state.dialog.handleOk} />
    </form>
  );
}

export default withStyles(styles)(Form);

function validateMessage(message) {
  return message.length >= 10 && message.length <= 800;
}
