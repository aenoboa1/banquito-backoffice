import axios from 'axios'


// URL LOCAL
export const BASE_URL = 'http://localhost:8080/api/v1/';
export const ENDPOINTS = {
    accounts: 'customers',
    geoStructure: 'geo-structure',
    geolocation: 'geo-location',
    country: 'country',
    holiday:'holiday'
}

export const createAPIEndpoint = endpoint => {

    let url = BASE_URL + endpoint + '/';
    let posturl = BASE_URL + endpoint ;

    //Holiday
    let urlHolidayGet = BASE_URL + endpoint + '/holiday-list-between-dates';
    let urlHolidayPost = BASE_URL + endpoint + '/holiday-create';
    let urlHolidayDelete = BASE_URL + endpoint + '/holiday-delete/';
    let urlHolidayUnique = BASE_URL + endpoint + '/holiday-get/';
    let urlHolidayPut = BASE_URL + endpoint + '/holiday-update';
    return {
        fetch: (token) => axios.get(url, token),
        post: (newRecord, token) => axios.post(posturl, newRecord, token),
        put: (id, updatedRecord, token) => axios.put(url + id, updatedRecord, token),
        delete: id => axios.delete(url + id),
        fetchById: (id, token) => axios.get(url + id, token),
        fetchByCode: (code, token) => axios.get(url + code, token),
        // Holiday
        fetchHolidayBetweenDates: (startDate, endDate, token) => axios.get(urlHolidayGet, {
            params: {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
            },
            token: token
        }),
        postHoliday: (newHoliday, token) => axios.post(urlHolidayPost, newHoliday),
        deleteHoliday:id => axios.delete(urlHolidayDelete+id),
        fectchHoliday:(id, token) => axios.get(urlHolidayUnique + id, token),
        putHoliday: (updatedHoliday, token) => axios.put(urlHolidayPut, updatedHoliday, token),
    }
}
