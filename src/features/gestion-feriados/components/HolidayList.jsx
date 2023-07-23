import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCellParams, GridColumns } from '@mui/x-data-grid';
import { styled } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    // Estilos personalizados aquí...
}));

const rows = [
    {
        id: 1,
        holidayDate: "23/11/2020",
        name: "Nacimiento del niño",
        type: "Nacional",
    },
];

export default function HolidayList() {
    const columns: GridColumns = [
        { field: 'holidayDate', headerName: 'Fecha', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Nombre', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'type', headerName: 'Tipo', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'actions',
            headerName: 'Acciones',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params: GridCellParams) => (
                <Box display="flex" justifyContent="flex-start">
                    <EditIcon color="primary" style={{ marginRight: '15px' }} />
                    <DeleteIcon color="primary" />
                </Box>
            ),
        },
    ];

    return (
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
    )
}