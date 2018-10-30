import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function DialogBox(props) {
  return (
    <Dialog
      open={props.dialog.open}
      onClose={props.onClose}
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
    >
      <DialogTitle id='alert-dialog-title'>{props.dialog.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id='alert-dialog-description'>
          {props.dialog.description}
        </DialogContentText>
      </DialogContent>
    {
      props.onOk ?
      <DialogActions>
        <Button onClick={props.onClose} color='secondary' autoFocus>
          Cancel
        </Button>
        <Button onClick={props.onOk} color='primary' autoFocus>
          Ok
        </Button>
      </DialogActions> :
      <DialogActions>
        <Button onClick={props.onClose} color='primary' autoFocus>
          Ok
        </Button>
      </DialogActions>
    }
    </Dialog>
  );
}

export default DialogBox;