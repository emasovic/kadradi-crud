import React, { Component } from 'react';
import { Grid, Container, Tab , Button} from 'semantic-ui-react';
import Objekti from './Objekti'
import post from '../fetch/post';

function ajSad() {
  post.secure('/checkToken', {});
}

const panes = [
  { menuItem: 'Objekti', render: () => <Tab.Pane>{<Objekti />}</Tab.Pane> },
  { menuItem: 'Korisnici', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
  { menuItem: 'Skreper', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
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
