import React, { useState } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import { validateEmail } from '../Validate';
import { styles, reactSelectStyle } from './EmailsInput.styles';

function EmailsInput(props) {
  const [emailInputError, setEmailInputError] = useState(() => false);
  function handleEmailsChange(emails) {
    props.onEmailsChange && props.onEmailsChange(emails);
  }
  function handleEmailInputChange(emailInput) {
    props.onEmailInputChange && props.onEmailInputChange(emailInput);
  }
  function handleKeyDown(event) {
    switch (event.key) {
      case 'Enter':
      case 'Tab':
      case ' ':
      case ',':
        event.preventDefault();
        addEmail();
        break;
      default:
    }
  }
  // Hack since react-select clear input on blur
  function addEmail(isFromBlur) {
    const isValid = validateEmail(props.emailInput);
    if (isValid) {
      const emails = [...props.emails, createEmailOption(props.emailInput)];
      handleEmailsChange(emails);
      handleEmailInputChange('');
    }
    setEmailInputError(!isValid && props.emailInput !== '' && !isFromBlur);
  }
  const newStyles = emailInputError || props.error ?
    {
      ...reactSelectStyle,
      control: () => ({
        border: 'none',
        borderBottom: '2px solid #f44336',
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
        onChange={handleEmailsChange}
        onInputChange={handleEmailInputChange}
        onKeyDown={handleKeyDown}
        onBlur={() => addEmail(true)}
        isMulti
        menuIsOpen={false}
        noOptionsMessage={() => 'Please enter valid email'}
        formatCreateLabel={(input) => `Press enter to add ${input}`}
        placeholder={'Testament receivers\' emails'}
        components={components}
        styles={newStyles}
        value={props.emails}
        inputValue={props.emailInput}
      />
      <FormHelperText error={emailInputError || props.error}>
        {emailInputError ? `"${props.emailInput}" is invalid email` : props.helperText}
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
