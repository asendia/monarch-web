const styles = theme => ({
  container: {
    maxWidth: 500,
    margin: '10px auto',
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginBottom: 10,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginTop: 10,
    minWidth: 120,
    overflow: 'hidden',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  switch: {
    margin: 'auto',
  },
});

export default styles;
