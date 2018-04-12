import React, { Component } from 'react';
import { Grid, Container, Tab , Button} from 'semantic-ui-react';
import post from '../fetch/post';

function ajSad() {
  post.secure('/checkToken', {});
}

const panes = [
  { menuItem: 'Tab 1', render: () => <Tab.Pane><Button onClick={() => {ajSad()}}>Click here</Button></Tab.Pane> },
  { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
  { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
]

class Crud extends Component {
  render() {
    return (
      <div style={{height:'100vh'}}>
        <Tab menu={{ fluid: true, vertical: true, tabular: 'right' }} panes={panes} />
      </div>
    );
  }
}
export default Crud;
