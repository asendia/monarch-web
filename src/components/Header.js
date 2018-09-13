import React from 'react';
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
            <h1 className='App-title'>cloudtestament{user ? `, ${name}` : ''}</h1>
            <p>Your last testament but in the cloud</p>
          </header>
        );
      }}
      </UserContext.Consumer>
    );
  }
}

export default Header;
