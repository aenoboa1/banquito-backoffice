import React, {useState} from 'react';
import {DataGrid} from '@mui/x-data-grid';
import {useLocation, useNavigate} from 'react-router-dom';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {createAPIEndpoint, ENDPOINTS} from "../../../../api";
import {Modal, Typography} from "@mui/material";
import {UpdateClientForm} from "./UpdateClientForm";
import useStateContext from "../../../../context/custom/useStateContext";
import {Call, Email, LocationCity, Person, Phone} from "@mui/icons-material";


const stateOptions = [
    {value: 'ACT', label: 'Activo'},
    {value: 'INA', label: 'Inactivo'},
    {value: 'SUS', label: 'Suspendido'},
    {value: 'BLO', label: 'Bloqueado'},
];

const documentTypes = [
    {label: 'Cédula', value: 'CID'},
    {label: 'Pasaporte', value: 'PASS'},
    {label: 'RUC', value: 'RUC'},
];

const genderTypes = [
    {label: 'Masculino', value: 'M'},
    {label: 'Femenino', value: 'F'},
];

const getColumnIcon = (field) => {
    switch (field) {
        case 'firstName':
            return <Person />;
        case 'emailAddress':
            return <Email />;
        case 'addresses':
            return <LocationCity />;
        default:
            return null;
    }
};




const StyledGridOverlay = styled('div')(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    '& .ant-empty-img-1': {
        fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
    },
    '& .ant-empty-img-2': {
        fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
    },
    '& .ant-empty-img-3': {
        fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
    },
    '& .ant-empty-img-4': {
        fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
    },
    '& .ant-empty-img-5': {
        fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
        fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
    },
}));


const phoneTypeTranslations = {
    'HOM': 'Casa',
    'MOB': 'Móvil',
    'OFF': 'Oficina',
    'OTH': 'Otro',
};

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "#f7f8f9", // Color
    boxShadow: 24,
    borderRadius: '3px',
    p: 4
};
function CustomNoRowsOverlay() {


    return (
        <StyledGridOverlay>
            <svg
                width="120"
                height="100"
                viewBox="0 0 184 152"
                aria-hidden
                focusable="false"
            >
                <g fill="none" fillRule="evenodd">
                    <g transform="translate(24 31.67)">
                        <ellipse
                            className="ant-empty-img-5"
                            cx="67.797"
                            cy="106.89"
                            rx="67.797"
                            ry="12.668"
                        />
                        <path
                            className="ant-empty-img-1"
                            d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
                        />
                        <path
                            className="ant-empty-img-2"
                            d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
                        />
                        <path
                            className="ant-empty-img-3"
                            d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
                        />
                    </g>
                    <path
                        className="ant-empty-img-3"
                        d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
                    />
                    <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
                        <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815"/>
                        <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z"/>
                    </g>
                </g>
            </svg>
            <Box sx={{mt: 1}}>No se encontró ningún cliente</Box>
        </StyledGridOverlay>
    );
}

export const CustomerDataGrid = ({data}) => {

// Inside CustomerDataGrid component
    const [selectedAddress, setSelectedAddress] = useState([]);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

    const handleAddressClick = (address) => {
        setSelectedAddress(address);
        setIsAddressModalOpen(true);
    };

    const handleCloseAddressModal = () => {
        setIsAddressModalOpen(false);
    };
    const [selectedPhones, setSelectedPhones] = useState([]);
    const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);

    const handlePhoneClick = (phones) => {
        setSelectedPhones(phones);
        setIsPhoneModalOpen(true);
    };

    const handleClosePhoneModal = () => {
        setIsPhoneModalOpen(false);
    };
    const {state} = useLocation();

    console.log(state.data);


    const navigate = useNavigate();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const {context, setContext} = useStateContext();
    const [customerData, setCustomerData] = useState();
    const handleEdit = (rowId) => {
        // Implement your edit logic here using the rowId

        setSelectedCustomer(rowId);
        setIsEditModalOpen(true);

        setContext({
            addresses: null,
            phones: null,
        });
        createAPIEndpoint(ENDPOINTS.clients).fetchCustomerById(
            rowId
        ).then(res => {

            navigate("/clientesnaturales/results/edit", { state: { data: res.data } });

        }).catch(err => console.log(err)
        )
    };

    const handleDelete = (rowId) => {
        // Implement your delete logic here using the rowId
        console.log('Delete row with ID:', rowId);
    };

    const columns = [
        {field: 'firstName', headerName: 'Nombres', width: 150}, // Use Spanish name for First Name
        {field: 'lastName', headerName: 'Apellidos', width: 150}, // Use Spanish name for Last Name
        {
            field: 'typeDocumentId',
            headerName: 'Tipo de Documento',
            width: 120,
            valueGetter: (params) => {
                const typeOptions = documentTypes.find((option) => option.value === params.value);
                return typeOptions ? typeOptions.label : '';
            },
        }, // Use Spanish name for State
        {field: 'documentId', headerName: 'Identificacion', width: 150}, //
        {
            field: 'gender',
            headerName: 'Género',
            width: 100,
            valueGetter: (params) => {
                const gender = genderTypes.find((gender) => gender.value === params.value);
                return gender ? gender.label : '';
            },
        }, // Use Spanish name for Gender
        {field: 'emailAddress', headerName: 'Correo Electrónico', width: 200}, // Use Spanish name for Email Address
        {
            field: 'state',
            headerName: 'Estado',
            width: 120,
            valueGetter: (params) => {
                const stateOption = stateOptions.find((option) => option.value === params.value);
                return stateOption ? stateOption.label : '';
            },
        }, // Use Spanish name for State
        {
            field: 'addresses',
            headerName: 'Direcciones',
            width: 250,
            renderCell: (params) => {
                const addresses = params.value;
                if (!addresses || addresses.length === 0) {
                    return 'No hay direcciones';
                }

                const formattedAddresses = addresses.map((address) => (
                    `${address.line1}${address.line2 ? ', ' + address.line2 : ''}`
                )).join('\n');

                return (
                    <div
                        style={{ whiteSpace: 'pre-wrap', cursor: 'pointer' }}
                        onClick={() => handleAddressClick(formattedAddresses)}
                    >
                        {formattedAddresses}
                    </div>
                );
            },
        },
        {
            field: 'phones',
            headerName: 'Teléfonos',
            width: 250,
            renderCell: (params) => {
                const phones = params.value;
                if (!phones || phones.length === 0) {
                    return 'No hay teléfonos';
                }
                const formattedPhones = phones.map((phone) => `${phone.phoneNumber}`).join(', ');
                return (
                    <div
                        style={{ whiteSpace: 'pre-wrap', cursor: 'pointer' }}
                        onClick={() => handlePhoneClick(phones)}
                    >
                        {formattedPhones}
                        <Phone style={{ marginLeft: '0.5rem' }} />
                    </div>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Acciones',
            width: 100,
            renderCell: (params) => {

                const rowId = params.row.id; // Get the ID of the current row
                return (
                    <div>
                        <IconButton
                            onClick={() => handleEdit(rowId)} // Add your edit function here
                            size="small"
                            color="primary"
                        >
                            <EditIcon/>
                        </IconButton>
                    </div>
                );
            },
        }
    ];

    return (
        <>
            <div style={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={state.data}
                    columns={columns}
                    pageSize={5}
                    slots={{
                        noRowsOverlay: CustomNoRowsOverlay,
                    }}
                    getRowHeight={() => 'auto'}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableRowSelectionOnClick
                />
            </div>


            <Modal
                open={isPhoneModalOpen}
                onClose={handleClosePhoneModal}
                aria-labelledby="phone-modal-title"
                aria-describedby="phone-modal-description"
            >

                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '300px', // Adjust the width to your preference
                        bgcolor: '#f0f0f0', // Phone-like color
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Phone-like shadow
                        borderRadius: '20px', // Phone-like rounded corners
                        p: 3, // Padding inside the phone box
                        textAlign: 'center', // Center the content
                        overflow: 'hidden', // Hide any overflowing content
                    }}
                >
                    <Typography variant="h6" component="h2" id="phone-modal-title">
                        Información de Teléfonos <Call/>
                    </Typography>
                    {selectedPhones.map((phone, index) => (
                        <div key={index}>
                            <Typography variant="subtitle1" gutterBottom>
                                <strong>Teléfono {index + 1}:</strong> {phone.phoneNumber}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                <strong>Tipo de Teléfono:</strong> {phoneTypeTranslations[phone.phoneType]}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                                <strong>Es Predeterminado:</strong> {phone.phoneIsDefault ? 'Sí' : 'No'}
                            </Typography>
                        </div>
                    ))}
                </Box>

            </Modal>


            <Modal
                open={isAddressModalOpen}
                onClose={handleCloseAddressModal}
                aria-labelledby="address-modal-title"
                aria-describedby="address-modal-description"
            >
                {selectedAddress && (

                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '300px', // Adjust the width to your preference
                                bgcolor: '#f0f0f0', // Phone-like color
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Phone-like shadow
                                borderRadius: '20px', // Phone-like rounded corners
                                p: 3, // Padding inside the phone box
                                textAlign: 'center', // Center the content
                                overflow: 'hidden', // Hide any overflowing content
                            }}
                        >
                        <Typography variant="h6" component="h2" id="address-modal-title">
                            Detalles de la Dirección
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <strong>Dirección:</strong> {selectedAddress.line1}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                            {selectedAddress.line2}
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                            <strong>Ciudad:</strong> {selectedAddress.city}
                        </Typography>
                        {/* Add more address details as needed */}
                    </Box>
                )}
            </Modal>
        </>
    );
};

// Usage
const data = [
    // The given response data
];

const App = () => {
    return (
        <DashboardLayout>
            <DashboardNavbar/>
            <CustomerDataGrid data={data}/>
        </DashboardLayout>
    );
};

export default App;
