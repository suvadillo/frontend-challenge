import React, { Component } from 'react';
import APIService from './APIService';
import Form from './Form';

const MAP_KEY = process.env.REACT_APP_MAPS_KEY;

const initialPosition = {
  lat: 48.866597,
  lng: 2.314670,
}

const styleMap = {
  width: '100%',
  height: '100%'
}

const icons = {
  pickup: {
    icon: "./img/pickUpMarker.svg"
  },
  dropoff: {
    icon: "./img/dropOffMarker.svg"
  }
};

class GoogleMap extends Component {

  constructor(props) {
    super(props);
    this.state = {
      googleMapScript: '',
      googleMap: '',
      pickupStatus: '',
      dropoffStatus: '',
      markers: [],
      success: false
    };
    this.googleMapRef = React.createRef();
    this.service = new APIService();
  }

  mapInit = () => {
    let googleMap, marker;
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&libraries=places`;
    window.document.body.appendChild(googleMapScript);

    googleMapScript.addEventListener('load', () => {
      googleMap = this.createGoogleMap();
      this.setState({
        googleMapScript: googleMapScript,
        googleMap: googleMap
      });
    });
  }
  
  createGoogleMap = () => {
    return new window.google.maps.Map(this.googleMapRef.current, {
      zoom: 15,
      center: initialPosition,
      disableDefaultUI: true,
    })
  }

  createMarker = (position, type) => {
    let marker = new window.google.maps.Marker({
      position: position,
      icon: icons[type].icon
    })
    this.state.markers.push(marker);
    return marker.setMap(this.state.googleMap)
  }

  checkSuccess = () => {
    if(this.state.pickupStatus === 'valid' && this.state.dropoffStatus === 'valid') {
      this.setState({
        success: true
      });
    } else {
      this.setState({
        success: false
      });
    }
  }

  geocode = (address, type) => {
    let status = `${type}Status`;
    this.service.geocode(address)
    .then ( res => {    
      const lat = res.latitude;
      const lng = res.longitude;
      this.createMarker({lat, lng}, type);
      this.setState({
        [status]: 'valid'
      });
      this.checkSuccess();
    })
    .catch ( err => {
      this.setState({
        [status]: 'invalid'
      });
    })
  }

  resetIcons = () => {
    this.setState({
      pickupStatus: '',
      dropoffStatus: '',
      success: false
    });
    this.state.markers.map( marker => marker.setMap(null) );
  }

  componentDidMount() {
    this.mapInit();
  }

  render() {    
    return (
      <>
      <div
        id="google-map"
        ref={this.googleMapRef}
        style={{ width: styleMap.width, height: styleMap.height }}
      />
      <Form 
        geocode={this.geocode}
        pickupStatus={this.state.pickupStatus}
        dropoffStatus={this.state.dropoffStatus}
        success={this.state.success}
        resetIcons={this.resetIcons}/>
      </>
    )
  }
  
}

export default GoogleMap;
