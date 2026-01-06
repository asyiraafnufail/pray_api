import axios from 'axios';

const API_BASE_URL = 'http://localhost:5555/api';

export const getCities = () => axios.get(`${API_BASE_URL}/cities`);
export const generateApiKey = () => axios.post(`${API_BASE_URL}/generate-key`);
export const getSchedule = (cityId, key) => 
  axios.get(`${API_BASE_URL}/schedule?cityId=${cityId}&key=${key}`);