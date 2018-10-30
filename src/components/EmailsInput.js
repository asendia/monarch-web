import React, { useState } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import { validateEmail } from '../Validate';

export default function EmailsInput(props) {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState([]);
  function handleChange(value) {
    setValue(value);
    props.onChange && props.onChange(value);
  }
  function handleInputChange(inputValue) {
    setInputValue(inputValue);
  }
  function handleKeyDown(event) {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
      case ' ':
      case ',':
        tryAddingEmail();
        event.preventDefault();
        break;
      default:
    }
  }
  function tryAddingEmail() {
    const isValid = value.length < 3 &&
      validateEmail(inputValue) &&
      value.find(v => v.value === inputValue) === undefined
    if (!isValid) {
      return;
    }
    const newValue = [...value, createEmailOption(inputValue)];
    setInputValue('');
    setValue(newValue);
    props.onChange && props.onChange(newValue);
  }
  const newStyles = props.error ?
    {
      ...styles,
      control: () => ({
        border: 'none',
        borderBottom: '2px solid #f44336',
        color: '#f44336',
      }),
      placeholder: (obj) => ({
        ...obj,
        color: '#f44336',
      }),
    } : styles;
  return (
    <CreatableSelect
      id={props.id}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onBlur={tryAddingEmail}
      isMulti
      menuIsOpen={false}
      noOptionsMessage={() => 'Please enter valid email'}
      formatCreateLabel={(input) => `Press enter to add ${input}`}
      placeholder={'Testament receivers\' emails'}
      components={components}
      styles={newStyles}
      value={props.value || value}
      inputValue={inputValue}
    />
  );
}

const components = {
  DropdownIndicator: null,
  ClearIndicator: null,
};

const styles = {
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

export function createEmailOption(label) {
  return {
    label,
    value: label,
  }
}
