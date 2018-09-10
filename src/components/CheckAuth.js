import React from 'react';
import axios from 'axios';
import { generateHeaders } from '../ApiCalls';

class CheckAuth extends React.Component {
  state = {
    text: '',
  };
  handleClick = async () => {
    this.setState({ text: 'loading...' });
    try {
      const headers = await generateHeaders(this.props.netlifyIdentity);
      await axios.post(
        'https://x46g8u90qd.execute-api.ap-southeast-1.amazonaws.com/default/test-auth',
        null, { headers },
      );
    } catch (err) {
      console.error(err);
      this.props.netlifyIdentity.logout();
      return this.setState({ text: 'failed to authorize' });
    }
    const user = this.props.netlifyIdentity.currentUser();
    const name = user && ((user.user_metadata && user.user_metadata.full_name) ||
      user.email);
    const text = name ? `welcome, ${name}` : '';
    this.setState({ text });
  }
  render() {
    return (
      <React.Fragment>
        <span>
          {this.state.text}
        </span>
        <button onClick={this.handleClick}>check auth</button>
      </React.Fragment>
    );
  }
}

export default CheckAuth;
