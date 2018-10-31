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
  const [form, setForm] = useState({
    emails: [],
    message: '',
    silentPeriod: 180,
    reminderInterval: 30,
    isActive: false,
  });
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    text: '',
  });
  const [validation, setValidation] = useState({
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  function loadFromSessionStorage() {
    if (typeof window === 'undefined' || !window.sessionStorage) {
      return;
    }
    try {
      const formRaw = window.sessionStorage.getItem('cloudtestament.form');
      const form = JSON.parse(formRaw);
      if (form !== null && form !== undefined) {
        setForm(form);
      }
    }
    catch (err) {
      window.sessionStorage.removeItem('cloudtestament.form');
    }
  }
  function handleChangeValue(key, value) {
    setForm({
      ...form,
      [key]: value,
    });
  }
  const handleChangeText = (key) => (event) => {
    handleChangeValue(key, event.target.value);
    if (key === 'message') {
      setValidation({
        ...validation,
        message: `${event.target.value.length}/800`,
        messageError: !validateMessage(event.target.value),
      });
    }
  }
  const handleChangeSelect = (key) => (event) => {
    handleChangeValue(key, parseInt(event.target.value, 10));
  }
  // Cron activation
  function handleActivationToggle(event) {
    if (!props.netlifyIdentity.currentUser()) {
      return openDialogInviteRegister();
    }
    setForm({
      ...form,
      isActive: event.target.checked,
    });
  }
  function handleEmailsChange(emails) {
    if (!emails) {
      return setValidation({
        ...validation,
        emailsError: true,
      })
    }
    setForm({
      ...form,
      emails,
    });
  }
  async function handleSubmit(event) {
    event.preventDefault();

    const emails = form.emails;
    const message = form.message.trim().replace(/\n\s*\n\s*\n/g, '\n\n');
    const isMessageValid = validateMessage(message);
    setValidation({
      ...validation,
      message: isMessageValid ?
        `${message.length}/800` :
        `${message.length}/800, message is too ${message.length < 10 ? 'short' : 'long'}`,
      messageError: !isMessageValid,
    });
    setForm({
      ...form,
      message,
    });
  
    if (!props.netlifyIdentity.currentUser()) {
      return openDialogInviteRegister();
    }
    if (validation.emailsError || !isMessageValid) {
      return;
    }

    // Submit form
    try {
      const headers = await generateHeaders(props.netlifyIdentity);
      setIsLoading(true);
      await axios.post(
        'https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/initiate',
        {
          ...form,
          emails: emails.map(email => email.value).join(', '),
        },
        { headers },
      );
      openDialogAfterSubmit();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  }
  function handleCloseDialog() {
    setDialog({
      title: '',
      open: false,
    });
  }
  function openDialogInviteRegister() {
    saveToSessionStorage(form);
    setDialog({
      open: true,
      title: 'Please login',
      description: 'You must login first in order to try cloudtestament',
    })
  }
  function openDialogAfterSubmit() {
    const message = form.isActive ?
      ' and ACTIVATED' :
      ' but NOT YET ACTIVE. Check the activation toggle and click submit to activate';
    setDialog({
      open: true,
      title: 'Submission complete',
      description: 'Your testament has been submitted' + message,
    })
  }
  useEffect(() => {
    saveToSessionStorage(form);
  }, [form]);
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
      setForm({
        ...res.data,
        emails: res.data.emails.split(', ').map(createEmailOption),
      });
    } catch (err) {
      if (typeof window !== 'undefined' && window.sessionStorage) {
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
      <EmailsInput
        id='emails'
        emails={form.emails}
        onChange={handleEmailsChange}
      />
      <TextField
        id='message'
        label='Testament message'
        autoComplete='off'
        className={classes.textField}
        value={form.message}
        error={validation.messageError}
        helperText={validation.message}
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
          value={form.silentPeriod}
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
          value={form.reminderInterval}
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
            checked={form.isActive}
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
        disabled={isLoading}
      >
        submit
      </Button>
      <DialogBox
        dialog={dialog}
        onClose={handleCloseDialog}
        onOk={dialog.handleOk} />
    </form>
  );
}

export default withStyles(styles)(Form);

function validateMessage(message) {
  return message.length >= 10 && message.length <= 800;
}

const saveToSessionStorage = debounce((form) => {
  if (typeof window === 'undefined' && !window.sessionStorage) {
    return;
  }
  window.sessionStorage.setItem('cloudtestament.form', JSON.stringify(form));
}, 500);
