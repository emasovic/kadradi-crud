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
      let arr = []
      arr = response.objects.length ? response.objects.map(item => {
        return (
          {
            ...item,
            checked: false
          }
        )
      }) : []
      this.setState({
        objects: arr,
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
      let arr = []
      arr = response.objects.length ? response.objects.map(item => {
        return (
          {
            ...item,
            checked: false
          }
        )
      }) : []
      this.setState({
        objects: arr,
        activeItem: name.toString(),
        pageNumber: name
      })
    }
  }
  toggle = (e, data, id) => {
    console.log("CHECKED", data.checked +' ' + id)
    let arr = this.state.objectsToAdd
    let objects = []
    if(data.checked) {
      arr.push(id)
      objects = this.state.objects.map(item => {
        let checked = item.checked;
        if(item.id == id) {
          checked = true
        }
        return(
          {
            ...item,
            checked
          }
        )
      })
    } else {
      let idToDel = arr.indexOf(id)
      arr.splice(idToDel, 1);
      objects = this.state.objects.map(item => {
        let checked = item.checked;
        if(item.id == id) {
          checked = false
        }
        return(
          {
            ...item,
            checked
          }
        )
      })
    }
    this.setState({
      objectsToAdd: arr,
      objects
    })
  }
  selectAll = (e, data) => {
    let arr = this.state.objectsToAdd
    let objects = []
    if(data.checked) {
      objects = this.state.objects.map(item => {
        arr.push(item.id)
        return(
          {
            ...item,
            checked: true
          }
        )
      })
    } else {
      objects = this.state.objects.map(item => {
        return(
          {
            ...item,
            checked: false
          }
        )
      })
      arr = []
    }
    this.setState({
      objectsToAdd: arr,
      objects
    })
  }
  addToApp = async () => {
    let response = await post.secure('/importObjects', {
      ids: this.state.objectsToAdd
    });
    console.log("REZPONZ", response)
  }
  goToObjDetail = (googleId) => {
    this.props.history.push(`/objDetails/${googleId}`)
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
            <div>
              <Table compact celled definition>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Ime</Table.HeaderCell>
                    <Table.HeaderCell>Grad</Table.HeaderCell>
                    <Table.HeaderCell>Ulica</Table.HeaderCell>
                    <Table.HeaderCell>
                      <Checkbox label='Select all' onChange={this.selectAll} />
                    </Table.HeaderCell>
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
                          <Checkbox checked={item.checked} onChange={(e, data) => this.toggle(e, data, item.id)} />
                          </Table.Cell>
                        </Table.Row>
                      )
                    })
                  }
                </Table.Body>
              </Table>
              <Button onClick={() => this.addToApp()}>
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
                    <Menu.Item key={item.number} name={item.number.toString()}
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
