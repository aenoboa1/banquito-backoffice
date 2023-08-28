import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridCellParams, GridColumns } from '@mui/x-data-grid';
import {styled} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button";
import {createAPIEndpoint, ENDPOINTS} from "../../../api";
import {useState} from "react";
import BranchUpdate from "./BranchUpdate";
import BranchForm from "./BranchForm";


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

export default function BranchesList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rows, setRows] = React.useState([]);
    const [error, setError] = useState(null);
    const [selectedBranchId, setSelectedBranchId] = useState(null);

    const bankEntityEndpoint = createAPIEndpoint(ENDPOINTS.bankEntity);

    const id = '64b1892b9c2c3b03c33a736f';
    const internationalCode = 'BQUIEC01';

    React.useEffect(() => {
        bankEntityEndpoint.fetchByPK(id, internationalCode, 'TU_TOKEN')
            .then(response => {
                console.log(response.data);
                const branchesData = response.data.branches;

                // Filtrar las sucursales con estado "ACTIVO"
                const activeBranches = branchesData.filter(branch => branch.state === 'ACT');

                const rowsWithId = activeBranches.map((branch, index) => ({
                    id: index, // Asignar el índice como id temporal
                    name: branch.name,
                    emailAddress: branch.emailAddress,
                    phoneNumber: branch.phoneNumber,
                    line1: branch.line1,
                    state: branch.state === 'ACT' ? 'ACTIVO' : 'INACTIVO',
                    uniqueKey: branch.uniqueKey
                }));
                setRows(rowsWithId);
            })
            .catch(error => {
                console.error('Error al obtener la lista de Entidad Bancaria:', error);
            });
    }, []);

    const fetchBranch = () => {
        bankEntityEndpoint.fetchByPK(id, internationalCode, 'TU_TOKEN')
            .then(response => {
                console.log(response.data);
                const branchesData = response.data.branches;
                const rowsWithId = branchesData.map((branch, index) => ({
                    id: index, // Asignar el índice como id temporal
                    name: branch.name,
                    emailAddress: branch.emailAddress,
                    phoneNumber: branch.phoneNumber,
                    line1: branch.line1,
                    state: branch.state === 'ACT' ? 'ACTIVO' : 'INACTIVO',
                    uniqueKey: branch.uniqueKey

                }));
                setRows(rowsWithId);
            })
            .catch(error => {
                console.error('Error al obtener la lista de Entidad Bancaria:', error);
            });
    };


    const clickDelete = (uniqueKey) => {
        // Encuentra el índice del objeto branch que tiene la uniqueKey deseada
        const branchIndex = rows.findIndex((branch) => branch.uniqueKey === uniqueKey);

        if (branchIndex !== -1) {
            // Obtén el objeto branch que corresponde a la uniqueKey
            const branchToDelete = rows[branchIndex];

            // Realiza la llamada a la API para eliminar la sucursal utilizando la uniqueKey
            bankEntityEndpoint.deleteBranch(branchToDelete.uniqueKey, 'TU_TOKEN')
                .then(() => {
                    // Actualiza el estado de rows después de eliminar la sucursal
                    setRows((prevRows) => prevRows.filter((branch) => branch.id !== branchIndex));
                })
                .catch(() => {
                    setError('El feriado ya se encuentra inactivo');
                });
        } else {
            setError('Sucursal no encontrada');
        }
    };

    const clickUpdate = (uniqueKey, updatedBranchData) => {
        // Encuentra el índice del objeto branch que tiene la uniqueKey deseada
        const branchIndex = rows.findIndex((branch) => branch.uniqueKey === uniqueKey);

        if (branchIndex !== -1) {
            // Obtén el objeto branch que corresponde a la uniqueKey
            const branchToUpdate = rows[branchIndex];

            // Realiza la llamada a la API para actualizar la sucursal utilizando la uniqueKey y los datos actualizados
            bankEntityEndpoint.putBranchUpdate(uniqueKey, updatedBranchData, 'TU_TOKEN')
                .then((response) => {
                    // Actualiza el estado de rows con la sucursal actualizada
                    setRows((prevRows) => {
                        const updatedRows = [...prevRows];
                        updatedRows[branchIndex] = response.data; // Suponiendo que la API devuelve el objeto actualizado
                        return updatedRows;
                    });
                })
                .catch((error) => {
                    setError('Error al actualizar la sucursal: ' + error.message);
                });
        } else {
            setError('Sucursal no encontrada');
        }
    };

    const [editedBranch, setEditedBranch] = useState('');

    const clickEdit = (uniqueKey) => {
        setSelectedBranchId(uniqueKey);

        // Encuentra la sucursal que se va a editar usando la uniqueKey
        const branchToEdit = rows.find((branch) => branch.uniqueKey === uniqueKey);
        if (branchToEdit) {
            // Establece los datos de la sucursal en el estado local
            setEditedBranch({
                name: branchToEdit.name,
                emailAddress: branchToEdit.emailAddress,
                phoneNumber: branchToEdit.phoneNumber,
                uniqueKey: branchToEdit.uniqueKey,
            });
        }
    };

    const handleFormSubmit = (updatedBranchData) => {
        if (editedBranch) {
            // Llamar a la función clickUpdate con los datos actualizados
            clickUpdate(editedBranch.uniqueKey, updatedBranchData);
            // Limpia los datos editados del estado local después de actualizar
            setEditedBranch('');
        }
    };

    const handleAddBranch = (newBranchData) => {
        // Agregar la nueva sucursal a la tabla
        setRows(prevRows => [...prevRows, {
            id: rows.length, // Opcional: Asignar un nuevo id temporal para la nueva fila
            name: newBranchData.name,
            emailAddress: newBranchData.emailAddress,
            phoneNumber: newBranchData.phoneNumber,
            line1: newBranchData.line1,
            state: 'ACTIVO', // Asignar el estado como 'ACTIVO' por defecto para una nueva sucursal
            uniqueKey: newBranchData.uniqueKey, // Opcional: si tienes un identificador único para cada sucursal
        }]);
    };

    const handleUpdateBranch = (uniqueKey, updatedBranchData) => {
        // Realiza la lógica para enviar los datos actualizados al servidor
        console.log('Datos actualizados:', updatedBranchData);
    };

    const handleCloseModal = () => {
        setSelectedBranchId(null);
    };

    const columns: GridColumns = [
        { field: 'name', headerName: 'Nombre', flex: 0.8, headerAlign: 'center', align: 'center' },
        { field: 'emailAddress', headerName: 'Correo', flex: 0.8, headerAlign: 'center', align: 'center' },
        { field: 'phoneNumber', headerName: 'Teléfono', flex: 0.5, headerAlign: 'center', align: 'center' },
        { field: 'line1', headerName: 'Dirección', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'state', headerName: 'Estado', flex: 0.5, headerAlign: 'center', align: 'center' },
        {
            field: 'actions',
            headerName: 'Acciones',
            headerAlign: 'center',
            align: 'center',
            width: 100,
            renderCell: (params: GridCellParams) => (
                <Box display="flex" justifyContent="flex-start">
                    <Button  onClick={()=>clickEdit(params.row.uniqueKey)}>
                        <EditIcon color="primary" style={{ marginRight: '15px' }} />
                    </Button>
                    <Button onClick={()=>clickDelete(params.row.uniqueKey)}>
                        <DeleteIcon color="primary" />
                    </Button>
                </Box>
            ),
        },
    ];


    return (
        <Box sx={{height: 400, width: '100%'}}>
            {/* Renderiza el formulario de edición solo cuando hay una sucursal seleccionada para editar */}
            {selectedBranchId && (
                <BranchUpdate branchData={editedBranch} onSubmit={handleFormSubmit} onClose={handleCloseModal} />
            )}

            {/* Renderiza el formulario de ingreso de nueva sucursal */}
            <BranchForm
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={() => fetchBranch()} // Actualiza la tabla llamando a fetchBranch para obtener los datos actualizados desde el servidor
                onAddBranch={handleAddBranch} // Pasa la función handleAddBranch como prop
            />

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
            />
        </Box>
    );
}
