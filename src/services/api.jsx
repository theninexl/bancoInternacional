import axios from "axios";

function Api(){
  axios.create({
    baseURL: 'http://85.54.47.35:8888/api/users/',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }});
}

export default Api;