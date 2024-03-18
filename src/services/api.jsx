import axios from 'axios';

const OTRO = window?._env_?.DB_SERVER;

const SERVER = import.meta.env.VITE_SERVER;
const PORT = import.meta.env.VITE_PORT;

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