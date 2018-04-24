import React, { Component } from 'react';
import { Grid, Menu, Tab, Button, Dropdown, Table, Checkbox } from 'semantic-ui-react';
import post from '../../fetch/post';
import { withRouter } from 'react-router';

class ScrapedObjects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      objects: [],
      objectsToAdd: [],
      pages: [],
      activeItem: '1',
    }
  }
  getAllObjCategories = async () => {
    let response = await post.secure('/allCategories', {});
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
    let response = await post.secure('/scrapedObjects', {
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
    let response = await post.secure('/scrapedObjects', {
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
  toggle = (e, data, id) => {
    let arr = this.state.objectsToAdd
    if(data.checked) {
      arr.push(id)
    } else {
      let idToDel = arr.indexOf(id)
      arr.splice(idToDel, 1);
    }
    this.setState({
      objectsToAdd: arr
    })
  }
  addToApp = async () => {
    let response = await post.secure('/importObjects', {
      ids: this.state.objectsToAdd
    });
  }
  goToObjDetail  = (googleId) => {
    this.props.history.push(`/objDetails/${googleId}`)
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
          onChange={this.categoryObjpage1}
          options={this.state.categories} />
        {
          this.state.objects.length ?
            <div>
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
                          <Table.Cell onClick={() => this.goToObjDetail(item.google_id)}>{item.name}</Table.Cell>
                          <Table.Cell>{item.city}</Table.Cell>
                          <Table.Cell>{item.streetAddres}</Table.Cell>
                          <Table.Cell>
                          <Checkbox onChange={(e, data) => this.toggle(e, data, item.id)} />
                          </Table.Cell>
                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>
              </Table>
              <Button onClick={() => this.addToApp(item.id)}>
              Dodaj u aplikaciju
              </Button>
            </div> : null
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
export default withRouter(ScrapedObjects);
