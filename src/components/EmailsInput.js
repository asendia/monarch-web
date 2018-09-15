import React, { Component } from 'react';
import CreatableSelect from 'react-select/lib/Creatable';
import { validateEmail } from '../Validate';

export default class EmailsInput extends Component {
  state = {
    inputValue: '',
    value: [],
  }
  handleChange = (value) => {
    this.setState({ value });
    this.props.onChange && this.props.onChange(value);
  }
  handleInputChange = (inputValue) => {
    this.setState({ inputValue });
  }
  handleKeyDown = (event) => {
    const { inputValue } = this.state;
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
      case ' ':
      case ',':
        this.tryAddingEmail();
        event.preventDefault();
        break;
      default:
    }
  }
  tryAddingEmail = () => {
    const { inputValue, value } = this.state;
    const isValid = value.length < 3 &&
    validateEmail(inputValue) &&
    value.find(v => v.value === inputValue) === undefined
    if (!isValid) {
      return;
    }
    const newValue = [...value, createEmailOption(inputValue)];
    this.setState({
      inputValue: '',
      value: newValue,
    });
    this.props.onChange && this.props.onChange(newValue);
  }
  render() {
    const newStyles = this.props.error ?
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
        id={this.props.id}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        onBlur={this.tryAddingEmail}
        isMulti
        menuIsOpen={false}
        noOptionsMessage={() => 'Please enter valid email'}
        formatCreateLabel={(input) => `Press enter to add ${input}`}
        placeholder={'Testament receivers\' emails'}
        components={components}
        styles={newStyles}
        value={this.props.value || this.state.value}
        inputValue={this.state.inputValue}
      />
    );
  }
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
