import React, { Component } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginButton from './components/LoginButton';
import './App.css';
import Form from './components/Form';
import { getParameterByName } from './QueryString';
import { protractTestament } from './ApiCalls';
import UserContext from './UserContext';

class App extends Component {
  async componentDidMount() {
    const mode = getParameterByName('mode');
    const token = getParameterByName('token');
    const id = getParameterByName('id');
    if (token && mode && id && token.length >= 128 && mode === 'protract') {
      try {
        await protractTestament(id, token);
        window.alert('Protraction success!');
      } catch (err) {}
      window.location.replace('/');
    }
  }
  render() {
    return (
      <div className='App'>
        <UserContext.Provider>
          <Header />
          <div className='App-intro'>
            <UserContext.Consumer>
            {({ user, netlifyIdentity }) => (
              <React.Fragment>
                <LoginButton user={user} netlifyIdentity={netlifyIdentity} />
                <div style={{ borderTop: '1px grey solid', margin: '0 8px' }} />
                <Form key={user && user.email} netlifyIdentity={netlifyIdentity} />
              </React.Fragment>
            )}
            </UserContext.Consumer>
          </div>
          <Footer />
        </UserContext.Provider>
      </div>
    );
  }
}

export default App;
