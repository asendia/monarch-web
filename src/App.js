import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import Header from './components/Header';
import LoginButton from './components/LoginButton';
import './App.css';

netlifyIdentity.init({
  container: '#netlify-modal' // defaults to document.body,
});

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Header />
        <p className='App-intro'>
        <LoginButton netlifyIdentity={netlifyIdentity} />
        </p>
        <p className='App-intro'>
          It is still WIP, visit <a href='https://www.fjbgame.com/contact'>fjbgame</a> if you want to contact me.
        </p>
      </div>
    );
  }
}

export default App;
