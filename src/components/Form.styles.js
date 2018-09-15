const styles = theme => ({
  container: {
    maxWidth: '500px',
    margin: '10px auto',
    display: 'flex',
    flexDirection: 'column',
  },
  textField: {
    marginBottom: 18,
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

export default styles;
