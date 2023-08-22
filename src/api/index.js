import axios from 'axios'

/// DEFINE URLS GCLOUD
export const BASE_URL = 'https://banquito-ws-gestion-admin-ntsumodxxq-uc.a.run.app/api/v1/';
export const BASE_ADMIN_URL = 'https://banquito-ws-gestion-admin-ntsumodxxq-uc.a.run.app/api/v1/';
export const CLIENTS_URL = 'https://banquito-ws-clientes-ntsumodxxq-uc.a.run.app/api/v1/';
export const ACCOUNTS_URL = 'https://banquito-ws-cuentas-ntsumodxxq-uc.a.run.app/api/v1/';
export const PASSIVE_PRODUCTS_URL = 'https://banquito-ws-productos-pasivos-ntsumodxxq-uc.a.run.app/api/v1/';

export const ENDPOINTS = {
    clients: 'customers',
    geoStructure: 'geo-structure',
    geolocation: 'geo-location',
    country: 'country',
    holiday: 'holiday',
    bankEntity: 'bankEntity',
    groupRole: 'group-role',
    groupCompany: 'group-company',
    productAccount: 'product-account',
}


export const createAPIEndpointProducts = endpoint => {
    let url = PASSIVE_PRODUCTS_URL + endpoint + '/';
    return {
        fetchAll: (token) => axios.get(url + 'all', token),
        fetchById: (id, token) => axios.get(url + id, token),
        fetchByType: (token) => axios.get(url + 'types', token),
    }
}

export const createAPIEndpointAccounts = endpoint => {

    let url = PASSIVE_PRODUCTS_URL + endpoint + '/';

    return {
        fetchAll: (token) => axios.get(url + 'all', token),
    }
}

export const createAPIEndpoint = endpoint => {
    let url = BASE_URL + endpoint + '/';
    let clientUrl = CLIENTS_URL + endpoint + '/';
    let businessurl = CLIENTS_URL + endpoint + '/';
    let businessRouteurl = CLIENTS_URL + endpoint;
    let clientPostUrl = CLIENTS_URL + endpoint;
    let groupRolesUrl = CLIENTS_URL + endpoint;
    let posturl = BASE_URL + endpoint;
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
    let urlHolidayActivate = BASE_URL + endpoint + '/holiday-activate/'

    let urlLocationGet = BASE_URL + endpoint + '/';

    let urlCountryGet = BASE_URL + endpoint;
    return {
        fetch: (token) => axios.get(url, token),
        post: (newRecord, token) => axios.post(posturl, newRecord, token),
        postClient: (newRecord, token) => axios.post(clientPostUrl, newRecord, token),
        put: (id, updatedRecord, token) => axios.put(url + id, updatedRecord, token),
        delete: id => axios.delete(url + id),


        // ================================================================= NATURAL CLIENT METHODS =================================================================
        // assign accounts to a customer
        postAccountCustomer: (newRecord, token) => axios.post(CLIENTS_URL + endpoint + '/assign/account', newRecord, token),
        // fetch a customer complete data By id
        fetchCustomerById: (id, token) => axios.get(clientUrl + id, token),
        // Update a customer
        putCustomer: (updatedRecord, token) => axios.put(clientPostUrl, updatedRecord, token),
        fetchByBranchAndLocationAndState: (branch, location, state, token) => axios.get(clientUrl + 'branchandlocationandstate?branch=' + branch + '&location=' + location + '&state=' + state, token),


        fetchById: (id, token) => axios.get(url + id, token),
        fetchGroupCompany: (token) => axios.get(businessurl + 'all', token),
        fetchByName: (name, token) => axios.get(url + "countries/" + name, token),
        fetchBranches: (id, token) => axios.get(adminurl + 'branch-list/' + id, token),
        fetchGroupRoles: (token) => axios.get(businessRouteurl, token),
        fetchByTypeDocumentAndDocumentId: (typeDocument, documentId, token) => axios.get(clientUrl + 'typeanddocument?typeDocument=' + typeDocument + '&document=' + documentId, token),
        fetchProvinceByCountry: (id, levelcode, token) => axios.get(adminurl + 'locations/' + id + '?levelCode=' + levelcode, token),
        //fetchProvinceByCountry: (id,levelcode,token) => axios.get(adminurl + 'locations/' + id + '?levelCode=' +levelcode, token),
        fetchByStatusOrDocumentOrBranch: (status, documentId, branch, token) => axios.get(url + 'statusanddocumentandbranch?status=' + status + '&documentId=' + documentId + '&branch=' + branch, token),
        fetchByCode: (code, token) => axios.get(url + code, token),
        fetchAll: (token) => axios.get(getAllUrl, token),
        fetchAllRoles: (token) => axios.get(groupRolesUrl, token),
        fetchAllCustomers: (token) => axios.get(clientUrl + 'all', token),
        // Holiday
        fetchHolidayBetweenDates: (startDate, endDate, selectedCountryCode, token) => axios.get(urlHolidayGet, {
            params: {
                start: startDate.toISOString(),
                end: endDate.toISOString(),
                country: selectedCountryCode,
            },
            token: token
        }),
        postHoliday: (newHoliday, codeCountry, idLocation, token) => axios.post(urlHolidayPost + `?codeCountry=${codeCountry}&idLocation=${idLocation}`, newHoliday),
        activateHoliday: id => axios.put(urlHolidayActivate + id),
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

        deleteBranch: id => axios.delete(urlBranchDelete + '64b1892b9c2c3b03c33a736F' + '/' + id),
        fetchBranch: (id, token) => axios.get(urlBranchUnique + id, token),
    }
}


