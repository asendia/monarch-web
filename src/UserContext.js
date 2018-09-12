import React from 'react';
import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.init({
  container: '#netlify-modal' // defaults to document.body,
});

const UserContext = React.createContext({
  netlifyIdentity,
  user: undefined,
});

class UserContextProvider extends React.Component {
  state = {
    netlifyIdentity,
    user: undefined,
    isLoading: false,
  }
  constructor(...args) {
    super(...args);
    const netlifyLogin = netlifyIdentity.login;
    netlifyIdentity.login = (...args) => {
      this.setState({ isLoading: true });
      netlifyLogin(...args);
    }
    const netlifyLogout = netlifyIdentity.logout;
    netlifyIdentity.logout = (...args) => {
      this.setState({ isLoading: true });
      netlifyLogout(...args);
    }
  }
  componentDidMount() {
    netlifyIdentity.on('init', user => {
      this.setState({ user, isLoading: false });
    });
    netlifyIdentity.on('login', user => {
      this.setState({ user, isLoading: false });
      netlifyIdentity.close();
    });
    netlifyIdentity.on('logout', () => {
      this.setState({ user: undefined, isLoading: false });
    });
    netlifyIdentity.on('error', err => {
      this.setState({ user: undefined, isLoading: false });
    });
    // netlifyIdentity.on('open', () => console.log('Widget opened'));
    // netlifyIdentity.on('close', () => console.log('Widget closed'));
  }
  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default {
  Provider: UserContextProvider,
  Consumer: UserContext.Consumer,
};
