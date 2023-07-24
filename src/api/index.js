import axios from 'axios'


// URL LOCAL
export const BASE_URL = 'https://banquito-ws-gestion-admin-production.up.railway.app/api/v1/';
export const BASE_ADMIN_URL = 'https://banquito-ws-gestion-admin-production.up.railway.app/api/v1/';
export const ENDPOINTS = {
    accounts: 'customers',
    geoStructure: 'geo-structure',
    geolocation: 'geo-location',
    country: 'country',
    holiday : 'holiday',
    bankEntity: 'bankEntity',
    groupRole: 'group-role',
    groupCompany: 'group-company',

}

export const createAPIEndpoint = endpoint => {

    let url = BASE_URL + endpoint + '/';
    let customerPUTurl = BASE_URL + endpoint ;
    let groupRolesUrl = BASE_URL + endpoint ;
    let posturl = BASE_URL + endpoint ;
    let adminurl = BASE_ADMIN_URL + endpoint + '/';

    let getAllUrl = BASE_URL + endpoint;

    let urlBankEntityGet = BASE_URL + endpoint + '/';
    let urlBranchPutCreate = BASE_URL + endpoint + '/branch-create/';
    let urlBranchPutUpdate = BASE_URL + endpoint + '/branch-update/';
    let urlBranchDelete = BASE_URL + endpoint + '/branch-delete/';
    let urlBranchUnique = BASE_URL + endpoint + '/branch-unique/';

    let urlHolidayGet = BASE_URL + endpoint + '/holiday-list-between-dates';
    let urlHolidayPost = BASE_URL + endpoint + '/holiday-create';
    let urlHolidayDelete = BASE_URL + endpoint + '/holiday-delete/';
    let urlHolidayUnique = BASE_URL + endpoint + '/holiday-get/';
    let urlHolidayPut = BASE_URL + endpoint + '/holiday-update';
    let urlHolidayGenerate = BASE_URL + endpoint + '/holiday-generate'

    let urlLocationGet = BASE_URL + endpoint + '/';

    let urlCountryGet = BASE_URL + endpoint;
    return {
        fetch: (token) => axios.get(url, token),
        post: (newRecord, token) => axios.post(posturl, newRecord, token),
        put: (id, updatedRecord, token) => axios.put(url + id, updatedRecord, token),
        delete: id => axios.delete(url + id),
        fetchById: (id, token) => axios.get(url + id, token),
        fetchGroupCompany: (token) => axios.get(url + 'all', token),
        fetchByName: (name, token) => axios.get(url + "countries/"+name,token),
        fetchBranches: (id,token) => axios.get(adminurl + 'branch-list/' + id, token),
        fetchGroupRoles : (token) => axios.get( groupRolesUrl, token),
        fetchByTypeDocumentAndDocumentId: (typeDocument, documentId, token) => axios.get(url + 'typeanddocument?typeDocument=' + typeDocument + '&document=' + documentId, token),
        fetchProvinceByCountry: (id,levelcode,token) => axios.get(adminurl + 'locations/' + id + '?levelCode=' +levelcode, token),
        fetchByStatusOrDocumentOrBranch: (status,documentId,branch, token) => axios.get(url + 'statusanddocumentandbranch?status=' + status + '&documentId=' + documentId + '&branch=' + branch, token),
        fetchByCode: (code, token) => axios.get(url + code,token),
        fetchAll: (token) => axios.get(getAllUrl, token),

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


        fetchByPK: (id, internationalCode, token) => axios.get(urlBankEntityGet + id + '/' + internationalCode, token),

        putBranchCreate: (newBranch, token) => axios.put(urlBranchPutCreate + '64b1892b9c2c3b03c33a736F', newBranch, token),

        putBranchUpdate: (uniqueKey, updatedBranch, token) =>
            axios.put(urlBranchPutUpdate + '64b1892b9c2c3b03c33a736F' + '/' + uniqueKey, updatedBranch, token),

        deleteBranch:id => axios.delete(urlBranchDelete + '64b1892b9c2c3b03c33a736F' + '/' + id),
        fetchBranch:(id, token) => axios.get(urlBranchUnique + id, token),
    }
}

