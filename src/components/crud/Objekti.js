import React, { Component } from 'react';
import { Grid, Container, Tab, Button, Dropdown } from 'semantic-ui-react';
import post from '../fetch/post';

class Objekti extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
    }
  }
  getAllObjCategories = async () => {
    let response = await post.secure('/allCategories', {
      token: this.props.token
    });
    if(response.token.success) {
      let categories = response.categories.map(item => {
        return (
          {
            key: item.id,
            value: item.id,
            text: item.nameM
          }
        )
      })
      this.setState({
        categories
      })
    }
  }
  handleItemClick = async ( e, { value } )  => {
    let response = await post.secure('/objectsFromCategories', {
      token: this.props.token,
      categoryId: value
    });
    console.log("OBJECT REP", response)
  }
  componentWillMount() {
    this.getAllObjCategories()
  }
  render() {
    console.log("STEJT", this.state)
    return (
      <div style={{ height: '100vh' }}>
      <Dropdown placeholder='Izaberite kategoriju' 
      fluid search selection
      onChange={this.handleItemClick}
      options={this.state.categories} />
        Ovo su objekti
      </div>
    );
  }
}
export default Objekti;
