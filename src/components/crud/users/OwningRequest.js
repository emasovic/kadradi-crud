import React, { Component } from 'react';
import post from '../../fetch/post';
import { withRouter } from 'react-router';
import { Grid, Menu, Tab, Button, Dropdown, Table, Icon } from 'semantic-ui-react';

class OwningRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      requests: [],
      pages: [],
      activePage: 1
    }
  }
  getAllUserRequest = async () => {
    let response = await post.secure('/owningRequest', {})
    if (response.token.success) {
      this.setState({
        requests: response.requests
      })
    }
  }
  acceptOwningRequest = async (requestId) => {
    let response = await post.secure('/acceptOwningRequest', {
      requestId
    })
    if(response.updated) {
      this.getAllUserRequest()
    }
  }
  declineOwningRequest = async (requestId) => {
    let response = await post.secure('/declineOwningRequest', {
      requestId
    })
    if(response.deleted) {
      this.getAllUserRequest()
    }
  }
  componentWillMount() {
    this.getAllUserRequest();
  }
  render() {
    console.log("STATE USERS", this.state)
    return (
      <div>
        {
          this.state.requests.length ?
            <Table compact celled definition>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Object</Table.HeaderCell>
                  <Table.HeaderCell>User</Table.HeaderCell>
                  <Table.HeaderCell>Action</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {
                  this.state.requests.map((item, key) => {
                    return (
                      <Table.Row key={item.requestId}>
                        <Table.Cell>
                          {item.object.name}
                        </Table.Cell>
                        <Table.Cell>
                          {item.user.firstName + " " + item.user.lastName + '(' + item.user.email + ')'}
                        </Table.Cell>
                        <Table.Cell>
                          <Button.Group>
                            <Button positive 
                            onClick={() => this.acceptOwningRequest(item.requestId)}>Prihvati</Button>
                            <Button.Or />
                            <Button negative 
                            onClick={() => this.declineOwningRequest(item.requestId)}>Odbij</Button>
                          </Button.Group>
                        </Table.Cell>
                        {/* <Table.Cell>
                          <Button icon onClick={() => this.editUser(item.userId)}>
                            <Icon name='edit' />
                          </Button>
                          <Button icon onClick={() => this.deleteUser(item.userId)}>
                            <Icon name='delete' />
                          </Button>
                        </Table.Cell> */}
                      </Table.Row>
                    )
                  })
                }
              </Table.Body>
            </Table> : null
        }
      </div>
    )
  }
}
export default withRouter(OwningRequest);
