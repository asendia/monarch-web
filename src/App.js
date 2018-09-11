import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import Header from './components/Header';
import Footer from './components/Footer';
import LoginButton from './components/LoginButton';
import './App.css';
import Form from './components/Form';
import { getParameterByName } from './QueryString';
import { protractTestament } from './ApiCalls';

netlifyIdentity.init({
  container: '#netlify-modal' // defaults to document.body,
});

class App extends Component {
  async componentDidMount() {
    const mode = getParameterByName('mode');
    const token = getParameterByName('token');
    if (token && mode && token.length >= 128 && mode === 'protract') {
      try {
        await protractTestament(token, netlifyIdentity);
        window.alert('Protraction success!');
      } catch (err) {}
      window.location.replace('/');
    }
  }
  render() {
    return (
      <div className='App'>
        <Header />
        <div className='App-intro'>
          <LoginButton netlifyIdentity={netlifyIdentity} />
          <div style={{ borderTop: '1px grey solid', margin: 20 }} />
          <Form netlifyIdentity={netlifyIdentity} />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
