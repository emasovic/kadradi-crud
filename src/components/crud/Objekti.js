import React, { Component } from 'react';
import { Grid, Menu, Tab, Button, Dropdown, Table, Icon } from 'semantic-ui-react';
import post from '../fetch/post';

class Objekti extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      objects: [],
      pageNumber: 1,
      categoryId: 0,
      activeItem: '1',
    }
  }
  getAllObjCategories = async () => {
    let response = await post.secure('/allCategories', {
      token: this.props.token
    });
    if (response.token.success) {
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
  categoryObjpage1 = async (e, { value }) => {
    let response = await post.secure('/objectsFromCategories', {
      token: this.props.token,
      categoryId: value,
      pageNumber: 1
    });
    if (response.token.success) {
      this.setState({
        objects: response.objects,
        categoryId: value
      })
    }
  }
  categoryObjpageN = async (name) => {
    let pageNumber = this.state.pageNumber
    if(name == 'More') {
      pageNumber = pageNumber + 1
      this.setState({
        pageNumber
      })
    } else {
      pageNumber = pageNumber - 1
      this.setState({
        pageNumber
      })
    }
    let response = await post.secure('/objectsFromCategories', {
      token: this.props.token,
      categoryId: value,
      page: pageNumber
    });
    if (response.token.success) {
      this.setState({
        objects: response.objects
      })
    }
  }
  componentWillMount() {
    this.getAllObjCategories()
  }
  render() {
    console.log("STEJT", this.state)
    let activeItem = this.state.activeItem
    return (
      <div style={{ height: '100vh' }}>
        <Dropdown placeholder='Izaberite kategoriju'
          fluid search selection
          onChange={this.categoryObjpage1}
          options={this.state.categories} />
        <Table compact celled definition>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {
              this.state.objects.length ?
                this.state.objects.map((item, key) => {
                  return (
                    <Table.Row key={item.id}>
                      <Table.Cell>{item.name}</Table.Cell>
                    </Table.Row>
                  )
                })
                : 'No results'
            }
          </Table.Body>
        </Table>
        <Menu borderless>
        <Menu.Item name='Less' active={activeItem === '1'} onClick={() => this.categoryObjpageN('Less')} />
        <Menu.Item name='More' active={activeItem === '2'} onClick={() => this.categoryObjpageN('More')} />
      </Menu>
      </div>
    );
  }
}
export default Objekti;
