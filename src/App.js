import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginButton from './components/LoginButton';
import './App.css';
import Form from './components/Form';
import { getParameterByName } from './QueryString';
import { protractTestament, unsubscribeTestament } from './ApiCalls';
import UserContext from './UserContext';

function App() {
  useEmailActionsQueryParser();
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

function useEmailActionsQueryParser() {
  useEffect(() => {
    async function callApi() {
      const mode = getParameterByName('mode');
      const token = getParameterByName('token');
      const id = getParameterByName('id');
      if (token && mode && id && token.length >= 64) {
        try {
          switch (mode) {
            case 'protract':
              await protractTestament(id, token);
              typeof window !== 'undefined' && window.alert('Protraction success!');
              break;
            case 'unsubscribe': {
              const email = getParameterByName('email');
              await unsubscribeTestament(id, token, email);
              typeof window !== 'undefined' && window.alert('Unsubscribe success!');
              break;
            }
            default:
              window.alert('Invalid mode.');
              break;
          }
        } catch (err) {}
        typeof window !== 'undefined' && window.location.replace('/');
      }
    }
    callApi();
  });
}

export default App;
