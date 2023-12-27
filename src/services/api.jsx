import axios from "axios";

const Api = {
  call: axios.create({
    //baseURL: 'http://10.60.20.31:8888/api/',
    baseURL: 'http://85.54.47.35:8888/api/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
  })
}

export default Api;