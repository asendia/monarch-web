import React, { Component } from 'react';
import logo from './logo.svg';
import netlifyIdentity from 'netlify-identity-widget';
import './App.css';

netlifyIdentity.init({
  container: "#netlify-modal" // defaults to document.body,
});
netlifyIdentity.on("init", user => console.log(user));
netlifyIdentity.on("login", user => console.log(user));
netlifyIdentity.on("logout", () => console.log("Logged out"));
netlifyIdentity.on("error", err => console.error("Logged out"));
netlifyIdentity.on("open", () => console.log("Widget opened"));
netlifyIdentity.on("close", () => console.log("Widget closed"));

class App extends Component {
  handleRegister = () => {
    netlifyIdentity.open('login');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to cloudtestament</h1>
        </header>
        <p className="App-intro">
          <button onClick={this.handleRegister}>Login</button>
        </p>
        <p className="App-intro">
          It is still WIP, visit <a href="https://www.fjbgame.com/contact">fjbgame</a> if you want to contact me.
        </p>
      </div>
    );
  }
}

export default App;
