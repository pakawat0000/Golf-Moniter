import axios from "axios"
import FormData from "form-data";


class API {
    constructor() {
        this.baseURL = "https://gensurv.ap.ngrok.io/";
        // this.baseURL = ' http://192.168.8.128:5000';
        // this.baseURL = ' http://192.168.0.104:5000';
        // this.baseURL = ' http://192.168.1.108:5000';
        this.formData = new FormData();
    }

    async get(url, token,signal=null) {
        const response = axios({
            method: 'get',
            url: url,
            timeout:5000,
            signal:signal,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
             
            baseURL: this.baseURL,
        });
        // return response;
        return { data: (await response).data, status: (await response).status };
    }
    async sumApi(url,data,token,signal) {
        let response = Promise.all([this.put(url[0],data[0],token,signal), this.put(url[1],data[1],token,signal)])
        return await response;
    }
    async postlogin(path,{ user = '', pass = '' },signal=null) {
        this.formData.append("username", user,);
        this.formData.append("password", pass);
        const response = axios({
            method: 'post',
            url: path,
            timeout: 5000,
            signal:signal,
            baseURL: this.baseURL,
            headers: this.formData.getHeaders,
            data: this.formData,
        });
        return { data: (await response).data, status: (await response).status };

    }

    async post(path, data, token,signal=null) {
        const response = axios({
            method: 'post',
            url: path,
            timeout: 5000,
            signal:signal,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            baseURL: this.baseURL,
            data: data,
        });
        return { data: (await response).data, status: (await response).status };

    }
    async delete(path, token,signal=null) {
        const response = axios({
            method: 'delete',
            url: path,
            timeout: 5000,
            signal:signal,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            baseURL: this.baseURL,
            data: "",
        });
        return { data: (await response).data, status: (await response).status };

    }

    async put(path, data, token,signal=null) {
        const response = axios({
            method: 'put',
            url: path,
            signal:signal,
            timeout:10000,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            baseURL: this.baseURL,
            data: data,
        });
        return { data: (await response).data, status: (await response).status };

    }



}

export default API;
