import React, { Component } from 'react';
import { Grid, Image, Label, Button, Segment, Header } from 'semantic-ui-react';
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
    let photo = Object.keys(this.state.objDetails).length && typeof this.state.objDetails.photos != 'undefined' ? this.state.objDetails.photos[0].photo_reference : ''
    let src = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + photo + '&key=AIzaSyDImc0NawEJTQwlDskJBSL7cidhVvlccvQ'
    let openingHours = typeof this.state.objDetails.opening_hours != 'undefined' ? this.state.objDetails.opening_hours.weekday_text : []
    console.log("STEJT", this.state)
    return (
      <div style={{ height: '100vh' }}>
        <Grid columns='equal'>
          <Grid.Row stretched>
            <Grid.Column>
              <Segment>
                <Label>
                  Telefon: {this.state.objDetails.formatted_phone_number}
                </Label>
              </Segment>
              <Segment>
                <Label>
                  Adresa: {this.state.objDetails.vicinity}
                </Label>
              </Segment>
            </Grid.Column>
            <Grid.Column width={6}>
              <Segment>
                <Header
                  as='h2'
                  textAlign='center'
                  image={this.state.objDetails.icon}
                  content={this.state.objDetails.name}
                />
                <Image centered src={src} />
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Segment>
                <Label>
                  Website:
                  <a href={this.state.objDetails.website}>
                    {this.state.objDetails.website || '/'}
                  </a>
                </Label>
              </Segment>
              <Segment>
                <Header
                  as='h2'
                  textAlign='center'
                  content='Radno vreme'
                />
                {
                  openingHours.length ?
                    openingHours.map((item, key) => {
                      return (
                        <div style={{ marginBottom: '2px' }} key={item}>
                          <Label>
                            {item}
                          </Label>
                        </div>
                      )
                    }) : '/'
                }
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
export default withRouter(ObjectDetails);
