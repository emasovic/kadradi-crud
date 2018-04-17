import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';
import { geolocated } from 'react-geolocated';
import styles from './scraper.css'
import { Input, Button, Dropdown } from 'semantic-ui-react';
import post from '../../fetch/post'; 

@geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})
class Scraper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      showingInfoWindow: true,
      activeMarker: {},
      selectedPlace: {},
      lat: 0,
      lng: 0
    }
  }
  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }
  onMapClicked = (e, props, clickEvent) => {
    if (this.state.showingInfoWindow) {
      let lat = clickEvent.latLng.lat()
      let lng = clickEvent.latLng.lng()
      this.setState({
        lat,
        lng
      })
    }
  };
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
  componentWillMount() {
    this.getAllObjCategories()
  }
  render() {
    console.log("PROPS", this.props)
    let radius = [
      {
        key: 1,
        value: 1,
        text: '1'
      },
      {
        key: 2,
        value: 2,
        text: '2'
      },
      {
        key: 3,
        value: 5,
        text: '5'
      },
      {
        key: 4,
        value: 10,
        text: '10'
      },
    ]
    console.log("STEJT", this.state)
    return (
      <div>
        {
          this.props.coords != null ?
            <div className={styles.map}>
              <Dropdown placeholder='Radius' name='radius' selection options={radius} />
              <Dropdown placeholder='Kategorije' name='kategorije' selection options={this.state.categories} />
              <Map
                onClick={this.onMapClicked}
                google={this.props.google}
                zoom={12}
                initialCenter={{
                  lat: this.props.coords.latitude,
                  lng: this.props.coords.longitude,
                }}>
                <Marker
                  position={{
                    lat: this.state.lat,
                    lng: this.state.lng
                  }}
                  name={'Dje sam'} />
              </Map>
            </div>
            : 'Lokacija je disejblovana'
        }
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyB78XZlt3Zi8SX1mMJy81qDqfhfQPqMw_g')
})(Scraper)