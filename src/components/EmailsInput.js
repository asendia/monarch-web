import React, { useState } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import { validateEmail } from '../Validate';
import { styles, reactSelectStyle } from './EmailsInput.styles';

function EmailsInput(props) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState();
  function handleChange(emails) {
    tryAddEmail();
    props.onChange && props.onChange(emails);
  }
  function handleInputChange(inputValue) {
    setInputValue(inputValue);
  }
  function handleKeyDown(event) {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
      case ' ':
      case ',':
        tryAddEmail();
        event.preventDefault();
        break;
      default:
    }
  }
  function tryAddEmail() {
    if (!inputValue) {
      return setError();
    }
    const invalidLength = props.emails.length >= 3;
    if (invalidLength) {
      return setError(`${props.emails.length}/3 emails, max 3 emails`)
    }
    const invalidEmail = !validateEmail(inputValue);
    if (invalidEmail) {
      return setError(`${inputValue} is invalid email`);
    }
    const duplicateValue = props.emails.find(v => v.value === inputValue);
    if (duplicateValue) {
      return setError(`Duplicate email: ${duplicateValue.value}`);
    }
    setError();
    const newValue = [...props.emails, createEmailOption(inputValue)];
    setInputValue('');
    props.onChange && props.onChange(newValue);
  }
  const newStyles = error ?
    {
      ...reactSelectStyle,
      control: () => ({
        border: 'none',
        borderBottom: '2px solid #f44336',
        color: '#f44336',
      }),
      placeholder: (obj) => ({
        ...obj,
        color: '#f44336',
      }),
    } : reactSelectStyle;
  return (
    <FormControl className={props.classes.formControl}>
      <CreatableSelect
        id={props.id}
        onChange={handleChange}
        onInputChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={tryAddEmail}
        isMulti
        menuIsOpen={false}
        noOptionsMessage={() => 'Please enter valid email'}
        formatCreateLabel={(input) => `Press enter to add ${input}`}
        placeholder={'Testament receivers\' emails'}
        components={components}
        styles={newStyles}
        value={props.emails}
        inputValue={inputValue}
      />
      <FormHelperText error={typeof error === 'string'}>
        {error || `${props.emails.length}/3 emails, e.g. john@doe.com, ainz@gmail.com`}
      </FormHelperText>
    </FormControl>
  );
}

export default withStyles(styles)(EmailsInput);

const components = {
  DropdownIndicator: null,
  ClearIndicator: null,
};

export function createEmailOption(label) {
  return {
    label,
    value: label,
  }
}
