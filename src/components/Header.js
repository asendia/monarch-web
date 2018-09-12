import React from 'react';
import logo from '../logo.svg';
import UserContext from '../UserContext';

class Header extends React.Component {
  render() {
    return (
      <UserContext.Consumer>
      {({ user }) => {
        let name;
        try {
          name = user.user_metadata.full_name.split(' ')[0];
        } catch (err) {}
        return (
          <header className='App-header'>
            <img src={logo} className='App-logo' alt='logo' />
            <h1 className='App-title'>Welcome to cloudtestament{user ? `, ${name}` : ''}</h1>
          </header>
        );
      }}
      </UserContext.Consumer>
    );
  }
}

export default Header;
