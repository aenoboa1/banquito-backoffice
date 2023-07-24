import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColumns } from '@mui/x-data-grid';
import { styled } from "@mui/material";
import { createAPIEndpoint, ENDPOINTS } from "../../../api";

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

export default function BankEntityList() {
    const [rows, setRows] = React.useState([]);

    const bankEntityEndpoint = createAPIEndpoint(ENDPOINTS.bankEntity);

    const id = '64b1892b9c2c3b03c33a736f';
    const internationalCode = 'BQUIEC01';

    React.useEffect(() => {
        bankEntityEndpoint.fetchByPK(id, internationalCode, 'TU_TOKEN')
            .then(response => {
                console.log(response.data); // Agrega esta línea para depurar la respuesta del servidor

                // Extraer el nombre y la información de las sucursales del objeto principal
                const { name, branches } = response.data;

                // Crear un array de objetos para cada sucursal con las propiedades name y code
                const branchesData = branches.map(branch => ({
                    name: branch.name,
                    line1: branch.line1,
                }));

                // Establecer el objeto principal como una fila en la DataGrid
                const dataObject = {
                    id: 'main', // Puedes asignar un id único para el objeto principal
                    name,
                    branches: branchesData,
                };

                // Establecer el objeto como único elemento en el array de rows
                setRows([dataObject]);
            })
            .catch(error => {
                console.error('Error al obtener la lista de Entidad Bancaria:', error);
            });
    }, []);

    const columns: GridColumns = [
        { field: 'name', headerName: 'Nombre de la Entidad Bancaria', flex: 2, headerAlign: 'center', align: 'center' },
        {
            field: 'branches',
            headerName: 'Sucursales',
            flex: 5,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                // Renderizar la información de las sucursales en forma vertical
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {params.value.map((branch, index) => (
                        <li key={index}>
                            {`${branch.name} - ${branch.line1}`}
                        </li>
                    ))}
                </ul>
            ),
        },
    ];

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <StyledDataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5]}
                rowHeight={200}
            />
        </Box>
    );
}
