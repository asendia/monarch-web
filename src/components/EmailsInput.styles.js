export const styles = theme => ({
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
});

export const reactSelectStyle = {
  container: () => ({
    padding: '0',
    fontSize: '16px',
  }),
  valueContainer: (obj) => ({
    ...obj,
    paddingLeft: '0',
    marginLeft: '-2px',
  }),
  control: () => ({
    border: 'none',
    borderBottom: '1px solid rgba(0, 0, 0, 0.42)',
  }),
};
