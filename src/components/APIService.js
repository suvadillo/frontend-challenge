import axios from 'axios';

class APIService {
  constructor() {
    let service = axios.create({
      baseURL: 'https://stuart-frontend-challenge.now.sh'
    });
    this.service = service;
  }

  geocode = async (address) => {
    const response = await this.service.post('/geocode', { address });
    return response.data;
  }

  postJob = async (pickup, dropoff) => {
    const response = await this.service.post('/jobs', { pickup, dropoff });
    return response.data;
  }

}

export default APIService;