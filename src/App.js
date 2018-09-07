import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to cloudtestament</h1>
        </header>
        <p className="App-intro">
          It is still WIP, visit <a href="https://www.fjbgame.com/contact">fjbgame</a> if you want to contact me.
        </p>
      </div>
    );
  }
}

export default App;
