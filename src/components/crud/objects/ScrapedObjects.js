import React, { Component } from 'react';
import { Grid, Menu, Tab, Button, Dropdown, Table, Icon } from 'semantic-ui-react';
import post from '../../fetch/post';
import { withRouter } from 'react-router';

class ScrapedObjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      objects: [],
      pages: []
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
      page: 1
    });
    if (response.token.success) {
      let pages = []
      for (let i = 1; i <= response.pagesLength; i++) {
        let page = {
          number: i
        }
        pages.push(page)
      }
      this.setState({
        objects: response.objects,
        categoryId: value,
        pages
      })
    }
  }
  categoryObjpageN = async (name) => {
    let response = await post.secure('/objectsFromCategories', {
      token: this.props.token,
      categoryId: this.state.categoryId,
      page: name
    });
    if (response.token.success) {
      this.setState({
        objects: response.objects,
        activeItem: name.toString(),
        pageNumber: name
      })
    }
  }
  componentWillMount() {
    this.getAllObjCategories()
  }
  render() {
    return (
      <div style={{ height: '100vh' }}>
        <Dropdown placeholder='Izaberite kategoriju'
          fluid search selection
          onChange={this.categoryObjpage1}
          options={this.state.categories} />
        {
          this.state.objects.length ?
            <Table compact celled definition>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Ime</Table.HeaderCell>
                  <Table.HeaderCell>Grad</Table.HeaderCell>
                  <Table.HeaderCell>Ulica</Table.HeaderCell>
                  <Table.HeaderCell>Akcija</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  this.state.objects.map((item, key) => {
                    return (
                      <Table.Row key={item.id}>
                        <Table.Cell>{item.name}</Table.Cell>
                        <Table.Cell>
                          <Button icon onClick={() => this.editObj(item.id)}>
                            <Icon name='edit' />
                          </Button>
                          <Button icon onClick={() => this.deleteObj(item.id)}>
                            <Icon name='delete' />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })
                }
              </Table.Body>
            </Table> : null
        }
        {
          this.state.pages.length ?
            <Menu borderless>
              {
                this.state.pages.map((item, key) => {
                  return (
                    <Menu.Item name={item.number.toString()}
                      active={this.state.activeItem === item.number.toString()}
                      onClick={() => this.categoryObjpageN(item.number)} />
                  )
                })
              }
            </Menu> : null
        }
      </div>
    );
  }
}
export default ScrapedObjects;
