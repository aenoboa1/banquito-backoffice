import axios from 'axios'
import { get } from 'react-hook-form';


// URL LOCAL
export const BASE_URL = 'http://localhost:8080/api/v1/';
export const ENDPOINTS = {
    accounts: 'customers',
    geoStructure: 'geo-structure',
    geolocation: 'geo-location',
    country: 'country'
}

export const createAPIEndpoint = endpoint => {

    let url = BASE_URL + endpoint + '/';
    let posturl = BASE_URL + endpoint ;
    let getAllUrl = BASE_URL + endpoint;
    return {
        fetch: (token) => axios.get(url, token),
        post: (newRecord, token) => axios.post(posturl, newRecord, token),
        put: (id, updatedRecord, token) => axios.put(url + id, updatedRecord, token),
        delete: id => axios.delete(url + id),
        fetchById: (id, token) => axios.get(url + id, token),
        fetchByCode: (code, token) => axios.get(url + code,token),
        fetchAll: (token) => axios.get(getAllUrl, token)
    }
}

