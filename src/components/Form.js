import React, { Component } from 'react';
import APIService from './APIService';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      pickup:'',
      dropoff: '',
      pickupStatus: '',
      dropoffStatus: '',
      success: false,
      disabledButton: true,
      timeoutGeocode: null,
      buttonText: 'Create Job'  
    }
    this.service = new APIService();

  }

  submitForm = e => {
    e.preventDefault();
    this.createJob(this.state.pickup, this.state.dropoff);
    this.setState({
      pickup:'',
      dropoff: '',
      pickupStatus: '',
      dropoffStatus: ''
    });
  }

  handleChanges = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
    if(this.state.timeoutGeocode) clearTimeout(this.state.timeoutGeocode);
    this.state.timeoutGeocode = setTimeout(() => {
      this.geocodeAddress(null, name)
    }, 750);
  }

  geocodeAddress = (e, name) => {
    if (e) name = e.target.name
    const addressType = name;
    this.props.geocode(this.state[addressType], addressType);
  }

  createJob = (pickup, dropoff) => {
    this.setState({
      buttonText: 'Creating...'
    })
    this.service.postJob(pickup, dropoff)
    .then(res => {
      if (res.pickup) {
        this.setState({
          success: true,
          buttonText: 'Create Job' 
        })
        this.props.resetIcons();
        setTimeout(() => this.hideToaster(), 5000);
      } else {
        this.setState({
          success: false,
          buttonText: 'Create Job' 
        });
      }
    })
    .catch( () => {
      this.setState({
        success: false,
        buttonText: 'Create Job' 
      });
    })
  }

  hideToaster = () => {
    this.setState({
      success: false,
      pickupStatus: '',
      dropoffStatus: '',
      disabledButton: true 
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      pickupStatus: nextProps.pickupStatus,
      dropoffStatus: nextProps.dropoffStatus,
      disabledButton: !nextProps.success
    };
  } 

  render() {
    return (
      <>
      <div className="container-form">
        <form onSubmit={this.submitForm} className="create-job">
          <div className={"pickup " + this.state.pickupStatus}>
            <input id="pickup"
                name="pickup"
                type="text"
                value={this.state.pickup}
                onChange={(e)=> this.handleChanges(e)}
                onBlur={(e)=> this.geocodeAddress(e)}
                placeholder='Pick up address'
                required/>
          </div>
    
          <div className={"dropoff " + this.state.dropoffStatus}>
            <input id="dropoff"
                name="dropoff"
                type="text"
                value={this.state.dropoff}
                onChange={(e)=> this.handleChanges(e)}
                onBlur={(e)=> this.geocodeAddress(e)}
                placeholder='Drop off address'
                required/>
          </div>
    
          <button disabled={this.state.disabledButton}>{this.state.buttonText}</button>
        </form>
      </div>
      <div className="job-success"
        style={{display: this.state.success ? 'block': 'none'}}
        onClick={this.hideToaster}>Job has been created sucessfully!</div>
      </>
    )
  }

}

export default Form;
