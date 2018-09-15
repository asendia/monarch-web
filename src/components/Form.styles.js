const styles = theme => ({
  container: {
    maxWidth: 500,
    margin: '10px auto',
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginBottom: 10,
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    marginTop: 10,
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

export default styles;
