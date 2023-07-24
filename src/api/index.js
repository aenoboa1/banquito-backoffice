import axios from 'axios'


// URL LOCAL
export const BASE_URL = 'http://localhost:8080/api/v1/';
export const BASE_ADMIN_URL = 'http://localhost:8081/api/v1/';
export const ENDPOINTS = {
    accounts: 'customers',
    geoStructure: 'geo-structure',
    geolocation: 'geo-location',
    country: 'country',
    bankEntity: 'bankEntity',

}

export const createAPIEndpoint = endpoint => {

    let url = BASE_URL + endpoint + '/';
    let posturl = BASE_URL + endpoint ;
    let adminurl = BASE_ADMIN_URL + endpoint + '/';

    let getAllUrl = BASE_URL + endpoint;
    return {
        fetch: (token) => axios.get(url, token),
        post: (newRecord, token) => axios.post(posturl, newRecord, token),
        put: (id, updatedRecord, token) => axios.put(url + id, updatedRecord, token),
        delete: id => axios.delete(url + id),
        fetchById: (id, token) => axios.get(url + id, token),
        fetchByName: (name, token) => axios.get(url + "countries/"+name,token),
        fetchBranches: (id,token) => axios.get(adminurl + 'branch-list/' + id, token),
        fetchProvinceByCountry: (id,levelcode,token) => axios.get(adminurl + 'locations/' + id + '?levelCode=' +levelcode, token),
        fetchByCode: (code, token) => axios.get(url + code,token),
        fetchAll: (token) => axios.get(getAllUrl, token)
    }
}

