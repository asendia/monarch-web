import React from 'react';
import logo from '../logo.svg';

class Header extends React.Component {
  render() {
    let name;
    try {
      name = this.props.netlifyIdentity.currentUser().user_metadata.full_name.split(' ')[0];
    } catch (err) {}
    return (
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <h1 className='App-title'>Welcome to cloudtestament{name ? `, ${name}!` : ''}</h1>
      </header>
    );
  }
}

export default Header;
