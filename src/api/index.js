import axios from 'axios'


// URL LOCAL
export const BASE_URL = 'https://banquito-ws-clientes-production.up.railway.app/api/v1/';
export const BASE_ADMIN_URL = 'https://banquito-ws-gestion-admin-production.up.railway.app/api/v1/';
export const ENDPOINTS = {
    accounts: 'customers',
    geoStructure: 'geo-structure',
    geolocation: 'geo-location',
    country: 'country',
    holiday: 'holiday',
    bankEntity: 'bankEntity',
    groupRole: 'group-role',
    groupCompany: 'group-company',
}

export const createAPIEndpoint = endpoint => {

    let url = BASE_URL + endpoint + '/';
    let posturl = BASE_URL + endpoint;
    let adminurl = BASE_ADMIN_URL + endpoint + '/';

    let getAllUrl = BASE_URL + endpoint;

    //Holiday
    let urlHolidayGet = BASE_URL + endpoint + '/holiday-list-between-dates';
    let urlHolidayPost = BASE_URL + endpoint + '/holiday-create';
    let urlHolidayDelete = BASE_URL + endpoint + '/holiday-delete/';
    let urlHolidayUnique = BASE_URL + endpoint + '/holiday-get/';
    let urlHolidayPut = BASE_URL + endpoint + '/holiday-update';
    let urlHolidayGenerate = BASE_URL + endpoint + '/holiday-generate'
    //Holiday - Location
    let urlLocationGet = BASE_URL + endpoint + '/';
    //Holiday - Country
    let urlCountryGet = BASE_URL + endpoint;
    return {
        fetch: (token) => axios.get(url, token),
        post: (newRecord, token) => axios.post(posturl, newRecord, token),
        put: (id, updatedRecord, token) => axios.put(url + id, updatedRecord, token),
        delete: id => axios.delete(url + id),
        fetchById: (id, token) => axios.get(url + id, token),
        fetchByName: (name, token) => axios.get(url + "countries/" + name, token),
        fetchBranches: (id, token) => axios.get(adminurl + 'branch-list/' + id, token),
        fetchProvinceByCountry: (id, levelcode, token) => axios.get(adminurl + 'locations/' + id + '?levelCode=' + levelcode, token),
        fetchByStatusOrDocumentOrBranch: (status, documentId, branch, token) => axios.get(url + 'statusanddocumentandbranch?status=' + status + '&documentId=' + documentId + '&branch=' + branch, token),
        fetchByCode: (code, token) => axios.get(url + code, token),
        fetchAll: (token) => axios.get(getAllUrl, token),
        fetchAllCustomers: (token) => axios.get(getAllUrl + '/all', token),
        // Holiday
        fetchHolidayBetweenDates: (startDate, endDate, token) => axios.get(urlHolidayGet, {
            params: {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
            },
            token: token
        }),
        postHoliday: (newHoliday, token) => axios.post(urlHolidayPost, newHoliday),
        deleteHoliday: id => axios.delete(urlHolidayDelete + id),
        fectchHoliday: (id, token) => axios.get(urlHolidayUnique + id, token),
        putHoliday: (updatedHoliday, token) => axios.put(urlHolidayPut, updatedHoliday, token),
        postHolidayGenerate: (year, month, saturday, sunday, codeCountry, idLocation, token) => {
            const params = {
                year: year,
                month: month,
                saturday: saturday.toString(),
                sunday: sunday.toString(),
                codeCountry: codeCountry,
                idLocation: idLocation,
            };
            return axios.post(urlHolidayGenerate, null, {
                params: params,
                token: token
            });
        },
        fetchCountry: (token) => axios.get(urlCountryGet, token),
    }
}

