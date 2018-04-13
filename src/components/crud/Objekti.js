import React, { Component } from 'react';
import { Grid, Container, Tab, Button } from 'semantic-ui-react';
import post from '../fetch/post';

class Objekti extends Component {
  getAllObjCategories = async () => {
    let categories = await post.secure('/allCategories', {
      token: this.props.token
    });
    console.log("CATEGORIES", categories)
  }
  componentWillMount() {
    this.getAllObjCategories()
  }
  render() {
    return (
      <div style={{ height: '100vh' }}>
        Ovo su objekti
      </div>
    );
  }
}
export default Objekti;
