import React from 'react';
import post from '../fetch/post';
import { withRouter } from 'react-router';

class Korisnici extends React.Component{
  componentWillMount() {
    this.getAllUsers();
  }
  getAllUsers = async () => {
    let response = await post.secure('/allUsers', {
      token: this.props.token
    });
    if (response.token.success) {
      console.log('RESPONSE KORISNICI', response)
    }
  }
  render() {
    return(
      <div>KORISNIKI</div>
    )
  }
}
export default withRouter(Korisnici);
