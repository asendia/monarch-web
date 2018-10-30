import React, { useState, useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';

netlifyIdentity.init({
  container: '#netlify-modal' // defaults to document.body,
});

const UserContext = React.createContext();

function UserContextProvider(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(netlifyIdentity.currentUser());
  const netlifyLogin = netlifyIdentity.login;
  netlifyIdentity.login = (...args) => {
    setIsLoading(true);
    netlifyLogin(...args);
  }
  const netlifyLogout = netlifyIdentity.logout;
  netlifyIdentity.logout = (...args) => {
    setIsLoading(true);
    netlifyLogout(...args);
  }
  useEffect(() => {
    netlifyIdentity.on('init', user => {
      setIsLoading(false);
      setUser(user);
    });
    netlifyIdentity.on('login', user => {
      setIsLoading(false);
      setUser(user);
      netlifyIdentity.close();
    });
    netlifyIdentity.on('logout', () => {
      if (window.sessionStorage) {
        window.sessionStorage.clear();
      }
      setIsLoading(false);
      setUser(undefined);
    });
    netlifyIdentity.on('error', err => {
      setIsLoading(false);
      setUser(undefined);
    });
    // netlifyIdentity.on('open', () => console.log('Widget opened'));
    // netlifyIdentity.on('close', () => console.log('Widget closed'));
  });
  return (
    <UserContext.Provider value={{
      netlifyIdentity,
      user,
      isLoading,
    }}>
      {props.children}
    </UserContext.Provider>
  );
}

export default {
  Provider: UserContextProvider,
  Consumer: UserContext.Consumer,
};
