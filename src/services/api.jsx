import axios from 'axios';

const SERVER = window?._env_?.DB_SERVER;
const SERVER2 = import.meta.env.VITE_DB_SERVER;


const baseURL = `${SERVER2}/api/`;

const Api = {
  call: axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
  })
}

export default Api;