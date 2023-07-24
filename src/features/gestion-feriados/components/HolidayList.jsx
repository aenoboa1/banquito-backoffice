import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCellParams, GridColumns } from '@mui/x-data-grid';
import { styled, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { createAPIEndpoint, ENDPOINTS } from './../../../api/index';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import {useState} from "react";
import HolidayEdit from './HolidayEdit';

const StyledDataGrid = styled(DataGrid)(({theme}) => ({
    border: 0,
    color:
        theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
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
        borderRight: `1px solid ${
            theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
        }`,
    },
    '& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell': {
        borderBottom: `1px solid ${
            theme.palette.mode === 'light' ? '#f0f0f0' : '#303030'
        }`,
    },
    '& .MuiDataGrid-cell': {
        color:
            theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.65)',
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
    if (type === 'NAT') {
        return 'Nacional';
    } else if (type === 'REG') {
        return 'Regional';
    }
    return type;
}

const formatState = (params) => {
    const state = params.value;
    if (state === 'ACT') {
        return 'Activo';
    } else if (state === 'INA') {
        return 'Inactivo';
    }
    return state;
}

export default function HolidayList() {
    const [error, setError] = useState(null);
    const [rows, setRows] = React.useState([]);
    const [startDate, setStartDate] = React.useState(new Date('2022-01-15T00:00:00.000Z'));
    const [endDate, setEndDate] = React.useState(new Date('2023-01-15T00:00:00.000Z'));
    const [selectedHolidayId, setSelectedHolidayId] = useState(null);

    const holidayEndpoint = createAPIEndpoint(ENDPOINTS.holiday);

    React.useEffect(() => {
        fetchHolidays();
    }, [startDate, endDate]);

    const fetchHolidays = () => {
        holidayEndpoint.fetchHolidayBetweenDates(startDate, endDate, 'TU_TOKEN')
            .then(response => {
                const rowsWithId = response.data.map(item => ({
                    id: item.uniqueId,
                    holidayDate: item.holidayDate,
                    name: item.name,
                    type: item.type,
                    state: item.state,
                }));
                setRows(rowsWithId);
            })
            .catch(error=> {
                console.log(error);
            });
    };

    const clickDelete = (id) =>{
        holidayEndpoint.deleteHoliday(id, 'TU_TOKEN')
          .then(() => {
                fetchHolidays();
            })
          .catch(() => {
                setError('El feriado ya se encuentra inactivo');
            });
    };

    const clickEdit = (id) =>{
        setSelectedHolidayId(id);
    }

    const columns: GridColumns = [
        { field: 'holidayDate', headerName: 'Fecha', flex: 1, headerAlign: 'center', align: 'center', valueGetter: (params) => formatDate(params)},
        { field: 'name', headerName: 'Nombre', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'type', headerName: 'Tipo', flex: 1, headerAlign: 'center', align: 'center', valueGetter:(params) => formatType(params) },
        { field: 'state', headerName: 'Estado', flex: 1, headerAlign: 'center', align: 'center', valueGetter:(params) => formatState(params) },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: GridCellParams) => (
                <Box display="flex" justifyContent="flex-start">
                    <Button  onClick={()=>clickEdit(params.row.id)}>
                        <EditIcon color="primary" style={{ marginRight: '15px' }} />
                    </Button>
                    <Button onClick={()=>clickDelete(params.row.id)}>
                        <DeleteIcon color="primary" />
                    </Button>
                </Box>
            ),
        },
    ];

    const updateHolidayInTable = (updatedHoliday) => {
        fetchHolidays();
    };
    return (
        <Box>
            {error && <div style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{error}</div>}
            <HolidayEdit
                isOpen={Boolean(selectedHolidayId)}
                onClose={() => setSelectedHolidayId(null)}
                selectedHolidayId={selectedHolidayId}
                updateHolidayInTable={updateHolidayInTable} />
            <Box display="flex" alignItems="center" justifyContent="center" my={2}>
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
    )
}