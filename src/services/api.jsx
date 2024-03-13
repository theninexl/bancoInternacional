import axios from 'axios';

const SERVER = window?._env_?.DB_SERVER;
const PORT = window?._env_?.DB_PORT;

const baseURL = `http://${SERVER}:${PORT}/api/`;

const Api = {
  call: axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
  })
}

export default Api;