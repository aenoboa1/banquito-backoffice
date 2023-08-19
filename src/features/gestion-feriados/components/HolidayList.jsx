import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCellParams, GridColumns } from '@mui/x-data-grid';
import { styled, Button, TextField, CircularProgress } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { createAPIEndpoint, ENDPOINTS } from './../../../api/index';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import HolidayEdit from './HolidayEdit';
import Alert from '@mui/material/Alert';
import Autocomplete from "@mui/material/Autocomplete";

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 0,
    color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
    fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
    ].join(','),
    WebkitFontSmoothing: 'auto',
    letterSpacing: 'normal',
    '& .MuiDataGrid-columnsContainer': {
        backgroundColor: theme.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
    },
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },
    '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
        borderRight: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'}`,
    },
    '& .MuiDataGrid-cell': {
        color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
    },
    '& .MuiPaginationItem-root': {
        borderRadius: 0,
    },
}));

const flatpickrStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
};

const formatDate = (params) => {
    const date = new Date(params.value);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());

    return `${day}/${month}/${year}`;
};

const formatType = (params) => {
    const type = params.value;
    return type === 'NAT' ? 'Nacional' : type === 'REG' ? 'Regional' : type;
};

const formatState = (params) => {
    const state = params.value;
    return state === 'ACT' ? 'Activo' : state === 'INA' ? 'Inactivo' : state;
};

export default function HolidayList() {
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [rows, setRows] = useState([]);
    const [startDate, setStartDate] = useState(new Date('2022-01-15T00:00:00.000Z'));
    const [endDate, setEndDate] = useState(new Date('2023-01-15T00:00:00.000Z'));
    const [selectedHolidayId, setSelectedHolidayId] = useState(null);

    const [openCountryAutocomplete, setOpenCountryAutocomplete] = useState(false);
    const [countryOptions, setCountryOptions] = useState([]);
    const [countryLoading, setCountryLoading] = useState(false);

    const [selectedCountryCode, setSelectedCountryCode] = useState("");

    const holidayEndpoint = createAPIEndpoint(ENDPOINTS.holiday);

    useEffect(() => {
        fetchHolidays();
        fetchCountryOptions();
    }, [startDate, endDate, openCountryAutocomplete, countryOptions]);

    const fetchHolidays = () => {
        if (startDate > endDate) {
            handleError('La fecha inicial no puede ser posterior a la fecha final');
            return;
        }

        holidayEndpoint.fetchHolidayBetweenDates(startDate, endDate, selectedCountryCode, 'TU_TOKEN')
            .then(response => {
                setError(null);
                setRows(response.data.map(item => ({
                    id: item.uniqueId,
                    holidayDate: item.holidayDate,
                    name: item.name,
                    type: item.type,
                    state: item.state,
                })));
            })
            .catch(handleError);
    };

    const fetchCountryOptions = () => {
        if (openCountryAutocomplete && countryOptions.length === 0) {
            setCountryLoading(true);

            fetchCountries()
                .then((res) => {
                    console.log('Paises obtenidos', res);
                    setCountryOptions(res);
                    setCountryLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setCountryLoading(false);
                });
        }
    };

    const fetchCountries = () => {
        return createAPIEndpoint(ENDPOINTS.country)
            .fetchCountry()
            .then((res) => {
                console.log('Datos paises', res.data);
                return res.data;
            })
            .catch((error) => {
                console.error(error);
                return [];
            });
    };

    const handleCountryAutocompleteChange = (_event, data) => {
        // Manejar la selección de país aquí
        console.log('País seleccionado:', data?.code ?? "");
        setSelectedCountryCode(data?.code || "");
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
        setRows([]);
        setTimeout(() => {
            setError(null);
        }, 4000);
    };

    const handleAction = (action, id, successMessage, errorMessage) => {
        holidayEndpoint[action](id, 'TU_TOKEN')
            .then(() => handleActionSuccess(successMessage))
            .catch(() => handleActionError(errorMessage));
    };

    const handleActionSuccess = (message) => {
        fetchHolidays();
        setSuccessMessage(message);
        setTimeout(() => {
            setSuccessMessage(null);
        }, 3500);
    };

    const handleActionError = (errorMessage) => {
        setError(errorMessage);
        setTimeout(() => {
            setError(null);
        }, 4000);
    };

    const handleEdit = (id) => {
        setSelectedHolidayId(id);
    };

    const columns: GridColumns = [
        { field: 'holidayDate', headerName: 'Fecha', flex: 1, headerAlign: 'center', align: 'center', valueGetter: (params) => formatDate(params) },
        { field: 'name', headerName: 'Nombre', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'type', headerName: 'Tipo', flex: 1, headerAlign: 'center', align: 'center', valueGetter: (params) => formatType(params) },
        { field: 'state', headerName: 'Estado', flex: 1, headerAlign: 'center', align: 'center', valueGetter: (params) => formatState(params) },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: GridCellParams) => (
                <Box display="flex" justifyContent="flex-start">
                    <Button onClick={() => handleEdit(params.row.id)}>
                        <EditIcon color="primary" style={{ marginRight: '15px' }} />
                    </Button>
                    {params.row.state === 'INA' ? (
                        <Button onClick={() => handleAction('activateHoliday', params.row.id, 'Feriado activado correctamente', 'El feriado ya se encuentra activo')}>
                            <CheckCircleOutlineIcon style={{ color: 'green' }} />
                        </Button>
                    ) : (
                        <Button onClick={() => handleAction('deleteHoliday', params.row.id, 'Feriado eliminado correctamente', 'El feriado ya se encuentra inactivo')}>
                            <DeleteIcon color="primary" />
                        </Button>
                    )}
                </Box>
            ),
        },
    ];

    const updateHolidayInTable = () => {
        fetchHolidays();
    };

    return (
        <Box>
            {error && (
                <Alert severity="error" style={{ marginBottom: '16px' }}>
                    {error}
                </Alert>
            )}
            {successMessage && (
                <Alert severity="success" style={{ marginBottom: '16px' }}>
                    {successMessage}
                </Alert>
            )}
            <HolidayEdit
                isOpen={Boolean(selectedHolidayId)}
                onClose={() => setSelectedHolidayId(null)}
                selectedHolidayId={selectedHolidayId}
                updateHolidayInTable={updateHolidayInTable} />
            <Box display="flex" alignItems="center" justifyContent="center" my={2}>
                <Box>
                    <Autocomplete
                        id="codeCountry"
                        open={openCountryAutocomplete}
                        onOpen={() => setOpenCountryAutocomplete(true)}
                        onClose={() => setOpenCountryAutocomplete(false)}
                        isOptionEqualToValue={(option, value) => option.code === value?.code}
                        getOptionLabel={(option) => option.name || ""}
                        options={countryOptions}
                        loading={countryLoading}
                        onChange={handleCountryAutocompleteChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Selecciona un país"
                                style={{width: 250}}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <React.Fragment>
                                            {countryLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>
                <Box mx={2} />
                <Box>
                    <label>Fecha Inicial:</label>
                    <Flatpickr
                        value={startDate}
                        options={{
                            dateFormat: 'Y-m-d',
                        }}
                        style={{ ...flatpickrStyle, maxWidth: '200px' }}
                        onChange={date => setStartDate(date[0])}
                    />
                </Box>
                <Box mx={2} />
                <Box>
                    <label>Fecha Final:</label>
                    <Flatpickr
                        value={endDate}
                        options={{
                            dateFormat: 'Y-m-d',
                        }}
                        style={{ ...flatpickrStyle, maxWidth: '200px' }}
                        onChange={date => setEndDate(date[0])}
                    />
                </Box>
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
                <StyledDataGrid
                    rows={rows}
                    columns={columns}
                    disableColumnMenu
                    disableColumnSelector
                    disableSelectionOnClick
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </Box>
        </Box>
    );
}