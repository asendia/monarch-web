import React from 'react';
import axios from 'axios';

class CheckAuth extends React.Component {
  state = {
    text: '',
  };
  generateHeaders = async (netlifyIdentity) => {
    const headers = { 'Content-Type': 'application/json' };
    if (netlifyIdentity && netlifyIdentity.currentUser()) {
      const token = await netlifyIdentity.currentUser().jwt();
      return { ...headers, Authorization: `Bearer ${token}` };
    }
    return headers;
  }
  handleClick = async () => {
    this.setState({ text: 'loading...' });
    try {
      const headers = await this.generateHeaders(this.props.netlifyIdentity);
      const res = await axios.post(
        'https://0r5xr9d88a.execute-api.ap-southeast-1.amazonaws.com/default/monarchUpsert',
        {},
        { headers },
      );
      console.log(res);
      this.setState({ text: `welcome, ${res.data.user_metadata.full_name}` });
    } catch (err) {
      console.error(err);
      this.setState({ text: 'failed to authorize' });
    }
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
