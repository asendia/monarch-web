import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class DialogBox extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.dialog.open}
        onClose={this.handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>{this.props.dialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            {this.props.dialog.description}
          </DialogContentText>
        </DialogContent>
      {
        this.props.onOk ?
        <DialogActions>
          <Button onClick={this.props.onClose} color='secondary' autoFocus>
            Cancel
          </Button>
          <Button onClick={this.props.onOk} color='primary' autoFocus>
            Ok
          </Button>
        </DialogActions> :
        <DialogActions>
          <Button onClick={this.props.onClose} color='primary' autoFocus>
            Ok
          </Button>
        </DialogActions>
      }
      </Dialog>
    );
  }
}

export default DialogBox;