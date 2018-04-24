import React, { Component } from 'react';
import { Grid, Image, Tab, Button, Dropdown, Table, Checkbox } from 'semantic-ui-react';
import post from '../../fetch/post';
import { withRouter } from 'react-router';

class ObjectDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objDetails: {},
    }
  }
  getObjDetails = async (placeId) => {
    let response = await post.secure('/objectDetails', {
      placeId
    });
    if (response.token.success) {
      this.setState({
        objDetails: response.details.result
      })
    }
  }
  componentWillMount() {
    this.getObjDetails(this.props.match.params.id)
  }
  render() {
    let photo = Object.keys(this.state.objDetails).length && this.state.objDetails.photos.length ? this.state.objDetails.photos[0].photo_reference : ''
    let src = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + photo + '&key=AIzaSyDImc0NawEJTQwlDskJBSL7cidhVvlccvQ'
    console.log("STEJT", this.state)
    return (
      <div style={{ height: '100vh' }}>
        <Grid celled='internally'>
          <Grid.Row>
            <Grid.Column width={3}>
              {this.state.objDetails.formatted_address} <br />
              {this.state.objDetails.formatted_phone_number}
            </Grid.Column>
            <Grid.Column centered width={13}>
              <Image centered src={src} />
              {this.state.objDetails.name}
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <Image src='/assets/images/wireframe/image.png' />
            </Grid.Column>
            <Grid.Column width={10}>
              <Image src='/assets/images/wireframe/paragraph.png' />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
export default withRouter(ObjectDetails);
