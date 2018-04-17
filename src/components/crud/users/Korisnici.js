import React from 'react';
import post from '../../fetch/post';
import { withRouter } from 'react-router';
import { Grid, Menu, Tab, Button, Dropdown, Table, Icon } from 'semantic-ui-react';

class Korisnici extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      pages: [],
      activePage: 1
    }
  }
  componentWillMount() {
    this.getAllUsers();
  }
  displayPage = async (page) => {
    let response = await post.secure('/allUsers', { page: page });
    if (response.token.success) {
      let users = response.users.map(item => {
        return {
          userId: item.id,
          userFirstName: item.firstName,
          userLastName: item.lastName,
          userEmail: item.email
        }
      })
      this.setState({
        users,
        activePage: page
      })
    }
  }
  deleteUser = async (userId) => {
    let response = await post.secure('/deleteUser', {
      userId
    })
    if (response.deleted){
      this.displayPage(this.state.activePage)
    }
  }
  displayUsers = async (page) => {
    let response = await post.secure('/allUsers', { page: page });
    if (response.token.success) {
      let users = response.users.map(item => {
        return {
          userId: item.id,
          userFirstName: item.firstName,
          userLastName: item.lastName,
          userEmail: item.email
        }
      })
      this.setState({
        users,
        activePage: page
      })
    }
  }
  getAllUsers = async () => {
    let response = await post.secure('/allUsers', { page: this.state.activePage });
    if (response.token.success) {
      let users = response.users.map(item => {
        return {
          userId: item.id,
          userFirstName: item.firstName,
          userLastName: item.lastName,
          userEmail: item.email
        }
      })
      console.log('RESPONSE KORISNICI', response)
      let pages = []
      for (let i = 1; i <= response.pages; i++) {
        let page = {
          page: i
        }
        pages.push(page)
      }
      this.setState({
        users,
        pages
      })
    }
  }
  editUser = (userId) => {
    this.props.history.push(`/editUsers/${userId}`);
  }
  render() {
    console.log("STATE USERS", this.state)
    return (
      <div>
        {
          this.state.users.length ?
            <Table compact celled definition>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Id</Table.HeaderCell>
                  <Table.HeaderCell>User</Table.HeaderCell>
                  <Table.HeaderCell>Email</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  this.state.users.map((item, key) => {
                    return (
                      <Table.Row key={item.userId}>
                        <Table.Cell>{item.userId}</Table.Cell>
                        <Table.Cell>{item.userLastName + " " + item.userFirstName}</Table.Cell>
                        <Table.Cell>{item.userEmail}</Table.Cell>
                        <Table.Cell>
                          <Button icon onClick={() => this.editUser(item.userId)}>
                            <Icon name='edit' />
                          </Button>
                          <Button icon onClick={() => this.deleteUser(item.userId)}>
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
                    <Menu.Item name={item.page.toString()}
                      active={this.state.activePage === item.page}
                      onClick={() => this.displayUsers(item.page)}
                    />
                  )
                })
              }
            </Menu> : null
        }
      </div>
    )
  }
}
export default withRouter(Korisnici);
