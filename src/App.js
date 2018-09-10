import React, { Component } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import Header from './components/Header';
import LoginButton from './components/LoginButton';
import './App.css';
// import CheckAuth from './components/CheckAuth';
import Detail from './components/Forms';

netlifyIdentity.init({
  container: '#netlify-modal' // defaults to document.body,
});

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Header />
        <div className='App-intro'>
          <LoginButton netlifyIdentity={netlifyIdentity} />
          {/* <CheckAuth netlifyIdentity={netlifyIdentity} /> */}
          <Detail netlifyIdentity={netlifyIdentity} />
        </div>
        <p className='App-intro'>
          It is still WIP, visit <a href='https://www.fjbgame.com/contact'>fjbgame</a> if you want to contact me.
        </p>
      </div>
    );
  }
}

export default App;
