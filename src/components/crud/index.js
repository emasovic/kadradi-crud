import React, { Component } from 'react';
import { Grid, Container, Tab , Button} from 'semantic-ui-react';
import Objekti from './objects/Objekti';
import Korisnici from './users/Korisnici';
import Scraper from './scraper/Scraper'
import post from '../fetch/post';

function ajSad() {
  post.secure('/checkToken', {});
}

const panes = [
  { menuItem: 'Objekti', render: () => <Tab.Pane><Objekti /></Tab.Pane> },
  { menuItem: 'Korisnici', render: () => <Tab.Pane><Korisnici /></Tab.Pane> },
  { menuItem: 'Skreper', render: () => <Tab.Pane><Scraper /></Tab.Pane> },
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
