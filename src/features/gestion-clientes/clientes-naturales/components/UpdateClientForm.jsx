import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Accordion, AccordionDetails, AccordionSummary, InputAdornment, Modal, Stack, TextField} from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import PhoneCreationForm from "./AddClientPhone";
import AddressCreationForm from "./AddClientAddress";
import {createAPIEndpoint, ENDPOINTS} from "../../../../api";
import MenuItem from "@mui/material/MenuItem";
import useStateContext from "../../../../context/custom/useStateContext";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {AccountCircle, AddCircleOutline, Business, ChatBubble, Email, ExpandMore} from "@mui/icons-material";
import Grid from "@mui/material/Grid";

import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import SoftButton from "../../../../components/SoftButton";
import {useLocation, useNavigate} from "react-router-dom";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import SoftBox from "../../../../components/SoftBox";

const validationSchema = yup.object({
    firstName: yup.string().required('Primer Nombre es requerido'),
    lastName: yup.string().required('Apellido es requerido'),
    emailAddress: yup
        .string()
        .email('Introduzca un email válido')
        .required('Email es requerido'),
    gender: yup.string().required('Seleccione un género'), // Add gender validation
    typeDocumentId: yup.string().required('Seleccione un tipo de documento'),
    birthDate: yup.date().required('Fecha de nacimiento es requerida'), // Step 2: Add birthDate validation
    documentId: yup.string().required('Documento de identidad es requerido'),
    branchId: yup.string().required('Seleccione una sucursal'),
    comments: yup.string().required('Comentario es requerido'),
});

export const UpdateClientForm = () => {



    const {state} = useLocation();

    const [customerData, setCustomerData] = useState(state.data);


    const {context, setContext} = useStateContext();

    const navigate = useNavigate();

    const [phones, setPhones] = useState(customerData?.phones || []);
    const [addresses, setAddresses] = useState(customerData?.addresses|| []);

    useEffect(() => {
        setContext(
            context.addresses = addresses,
            context.phones = phones

        )
    }, []);

    const {control, handleSubmit, formState: {errors}, reset} = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: customerData?.firstName || '',
            lastName: customerData?.lastName || '',
            emailAddress: customerData?.emailAddress || '',
            gender: customerData?.gender || '',
            typeDocumentId: customerData?.typeDocumentId || '',
            birthDate: customerData?.birthDate ? new Date(customerData.birthDate) : new Date(),
            documentId: customerData?.documentId || '',
            branchId: customerData?.branchId || '',
            comments: customerData?.comments || '',
            phones: customerData?.phones || '',
            addresses: customerData?.addresses || '',
            // Add more fields with default values here...
        },
    });

    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    const [openBranches, setOpenBranches] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = openBranches && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {

                createAPIEndpoint(ENDPOINTS.bankEntity).fetchBranches('64b1892b9c2c3b03c33a736f'
                    ,
                    {}
                ).then(
                    res => {
                        console.log(res.data);
                        setOptions(res.data);

                    }).then(
                    err => console.log(err)
                )
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!openBranches) {
            setOptions([]);
        }
    }, [openBranches]);


    const onSubmit = (data) => {

        const updatedcontext = {
            addresses: Array.isArray(context.addresses) ? [...context.addresses] : [],
            phones: Array.isArray(context.phones) ? [...context.phones] : [],
            ...data,
            customerId: customerData.id, // Append the customer ID to the context
        };

        createAPIEndpoint(ENDPOINTS.clients,
        ).putCustomer(updatedcontext, {}).then(

        ).catch(
            err => console.log(err)
        )
    };

    function handleSearch(e) {
        e.preventDefault();
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "#f7f8f9", // Color
        boxShadow: 24,
        borderRadius: '3px',
        p: 4
    };

    const handleDeletePhone = (index) => {
        const updatedPhones = context.phones.filter((_, i) => i !== index);
        const updatedContext = {
            ...context,
            phones: updatedPhones,
        };
        setContext(updatedContext);
    };
    const handleDeleteAddress = (index) => {
        const updatedAddresses = context.addresses.filter((_, i) => i !== index);
        const updatedContext = {
            ...context,
            addresses: updatedAddresses,
        };
        setContext(updatedContext);
    };
    const phoneTypes = [
        {label: 'Cédula', value: 'CID'},
        {label: 'Pasaporte', value: 'PASS'},
        {label: 'RUC', value: 'RUC'},
    ];

    const genderTypes = [
        {label: 'Masculino', value: 'M'},
        {label: 'Femenino', value: 'F'},
    ];

    const getPhoneTypeLabel = (value) => {
        switch (value) {
            case 'HOM':
                return 'Casa';
            case 'MOB':
                return 'Móvil';
            case 'OFF':
                return 'Oficina';
            case 'OTH':
                return 'Otro';
            default:
                return 'Desconocido';
        }
    };

    const [openAddress, setOpenAddress] = React.useState(false);
    const handleOpenAddress = () => setOpenAddress(true);

    const {secondary} = colors;
    const {borderWidth} = borders;

    const handleCloseAddress = () => setOpenAddress(false);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Function to add a new phone number field

    return (


        <DashboardLayout>
            <DashboardNavbar/>


            <Grid container spacing={2}>

                <SoftBox
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="100vh"
                >

                    <Grid item xs={8}>
                        <Stack gap={5}>
                            <Stack spacing={2} alignItems="center">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Grid container rowSpacing={3} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                                        <Grid item xs={12}>
                                            {/* First Name */}
                                            <Controller
                                                name="firstName"
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        fullWidth
                                                        type="text"
                                                        id="firstName"
                                                        label="Nombre"
                                                        {...field}
                                                        error={Boolean(errors.firstName)}
                                                        helperText={errors.firstName?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            {/* Last Name */}
                                            <Controller
                                                name="lastName"
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        fullWidth
                                                        type="text"
                                                        id="lastName"
                                                        label="Apellido"
                                                        {...field}
                                                        error={Boolean(errors.lastName)}
                                                        helperText={errors.lastName?.message}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            {/* Email Address */}
                                            <Controller
                                                name="emailAddress"
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        fullWidth
                                                        type="text"
                                                        id="emailAddress"
                                                        label="Email"
                                                        {...field}
                                                        error={Boolean(errors.emailAddress)}
                                                        helperText={errors.emailAddress?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Email/>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            {/* Gender */}

                                            <Controller
                                                name="gender"
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        select // tell TextField to render select
                                                        label="Género"
                                                        error={Boolean(errors.gender)}
                                                        helperText={errors.gender?.message}
                                                    >
                                                        {genderTypes.map((type) => (
                                                            <MenuItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            {/* Type of Document */}
                                            <Controller
                                                name="typeDocumentId"
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        select // tell TextField to render select
                                                        label="Tipo de Documento"
                                                        error={Boolean(errors.typeDocumentId)}
                                                        helperText={errors.typeDocumentId?.message}
                                                    >
                                                        {phoneTypes.map((type) => (
                                                            <MenuItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            {/* Document ID */}
                                            <Controller
                                                name="documentId"
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        fullWidth
                                                        type="text"
                                                        id="documentId"
                                                        label="Documento de Identidad"
                                                        {...field}
                                                        error={Boolean(errors.documentId)}
                                                        helperText={errors.documentId?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <AccountCircle/>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            {/* Birth Date */}
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Controller
                                                    control={control}
                                                    name="birthDate"
                                                    render={({field}) => (
                                                        <DatePicker
                                                            slotProps={{textField: {fullWidth: true}}}
                                                            onChange={(date) => field.onChange(date)}
                                                            selected={field.value}
                                                            label="Fecha de Nacimiento"
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Grid>

                                        <Grid item xs={6}>
                                            {/* Comments */}
                                            <Controller
                                                name="comments"
                                                control={control}
                                                render={({field}) => (
                                                    <TextField
                                                        fullWidth
                                                        type="text"
                                                        id="comments"
                                                        label="Comentario"
                                                        {...field}
                                                        error={Boolean(errors.comments)}
                                                        helperText={errors.comments?.message}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <ChatBubble/>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            {/* Branch */}
                                            <Controller
                                                name="branchId"
                                                control={control}
                                                render={({field}) => (
                                                    <Autocomplete
                                                        id="branchId"
                                                        open={openBranches}
                                                        onOpen={() => {
                                                            setOpenBranches(true);
                                                        }}
                                                        onClose={() => {
                                                            setOpenBranches(false);
                                                        }}
                                                        getOptionSelected={(option, value) =>
                                                            value === undefined || value === "" || option.uniqueKey === value.uniqueKey
                                                        }
                                                        isOptionEqualToValue={(option, value) => option.uniqueKey === value?.uniqueKey}
                                                        getOptionLabel={(option) => option.name || ''}
                                                        fullWidth
                                                        options={options}
                                                        loading={loading}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Seleccione una Sucursal"
                                                                InputProps={{
                                                                    ...params.InputProps,
                                                                    endAdornment: (
                                                                        <React.Fragment>
                                                                            {loading ?
                                                                                <CircularProgress color="inherit"
                                                                                                  size={20}/> : null}
                                                                            {params.InputProps.endAdornment}
                                                                        </React.Fragment>
                                                                    ),
                                                                    startAdornment: (
                                                                        <InputAdornment position="start">
                                                                            <Business/>
                                                                        </InputAdornment>
                                                                    ),
                                                                }}
                                                                error={Boolean(errors.branchId)}
                                                                helperText={errors.branchId?.message}
                                                            />
                                                        )}
                                                        onChange={(_event, data) => field.onChange(data?.uniqueKey ?? '')}
                                                    />
                                                )}
                                            />
                                        </Grid>


                                        <Grid item xs={6}>
                                            <Button onClick={handleOpen} variant="contained"
                                                    startIcon={<AddCircleOutline/>}>
                                                Añadir
                                                Teléfono {/* Assuming "Teléfono" is the correct spelling for "phone" in your language */}
                                            </Button>
                                            <Modal
                                                open={open}
                                                onClose={handleClose}
                                                aria-labelledby="modal-modal-title"
                                                aria-describedby="modal-modal-description"
                                                style={{backdropFilter: "blur(5px)"}}
                                            >
                                                <Box sx={style}>
                                                    <PhoneCreationForm/>
                                                </Box>
                                            </Modal>
                                        </Grid>

                                        <Grid item xs={6}>
                                            {context.phones && (
                                                <>
                                                    {context.phones.map((phone, index) => (
                                                        <Box gridColumn="span 12">
                                                            <div>
                                                                <Accordion key={index}>
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMore/>}
                                                                        aria-controls="panel1a-content"
                                                                        id="panel1a-header"
                                                                    >
                                                                        <Box sx={{
                                                                            display: 'grid',
                                                                            gridTemplateColumns: 'repeat(12, 1fr)',
                                                                            gap: 4
                                                                        }}>
                                                                            <Box gridColumn="span 12"
                                                                                 sx={{position: 'relative'}}>
                                                                                <SoftTypography align="center"
                                                                                                sx={{fontWeight: 'bold'}}>
                                                                                    Teléfono {index + 1}
                                                                                </SoftTypography>

                                                                            </Box>
                                                                        </Box>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        <Box>
                                                                            <SoftTypography>{`Número: ${phone.phoneNumber}`}</SoftTypography>
                                                                            <SoftTypography>{`Tipo: ${getPhoneTypeLabel(phone.phoneType)}`}</SoftTypography>
                                                                            <SoftTypography>{`¿Predeterminado?: ${phone.isDefault ? 'Sí' : 'No'}`}</SoftTypography>
                                                                        </Box>
                                                                        <Box sx={{
                                                                            position: 'absolute',
                                                                            bottom: 0,
                                                                            right: 0
                                                                        }}>

                                                                                <IconButton aria-label="delete"
                                                                                            onClick={() => handleDeletePhone(index)}>
                                                                                    <DeleteIcon fontSize="small"/>
                                                                                </IconButton>
                                                                        </Box>
                                                                        {/* Optionally add more details here */}
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </div>
                                                        </Box>
                                                    ))}
                                                </>
                                            )}
                                        </Grid>


                                        <Grid item xs={6}>
                                            <div>

                                                <Button onClick={handleOpenAddress} variant="contained"
                                                        startIcon={<AddCircleOutline/>}>
                                                    Añadir Dirección
                                                </Button>
                                                <Modal
                                                    open={openAddress}
                                                    onClose={handleCloseAddress}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                    style={{backdropFilter: "blur(5px)"}}
                                                >
                                                    <Box sx={style}>
                                                        <AddressCreationForm/>
                                                    </Box>
                                                </Modal>
                                            </div>
                                        </Grid>

                                        {context.addresses && (
                                            <>
                                                <Grid item xs={6}>
                                                    {context.addresses.map((address, index) => (

                                                        <Box gridColumn="span 12">
                                                            <div>
                                                                <Accordion key={index}>
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMore/>}
                                                                        aria-controls="panel1a-content"
                                                                        id="panel1a-header"
                                                                    >
                                                                        <Box sx={{
                                                                            display: 'grid',
                                                                            gridTemplateColumns: 'repeat(12, 1fr)',
                                                                            gap: 4
                                                                        }}>
                                                                            <Box gridColumn="span 12"
                                                                                 sx={{position: 'relative'}}>
                                                                                <SoftTypography align="center"
                                                                                                sx={{fontWeight: 'bold'}}>
                                                                                    Dirección {index + 1}
                                                                                </SoftTypography>
                                                                            </Box>
                                                                        </Box>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails sx={{position: 'relative'}}>
                                                                        <Box>
                                                                            <SoftTypography>{`Tipo de Dirección: ${address.typeAddress}`}</SoftTypography>
                                                                            <SoftTypography>{`Dirección Línea 1: ${address.line1}`}</SoftTypography>
                                                                            <SoftTypography>{`Dirección Línea 2: ${address.line2}`}</SoftTypography>
                                                                            <SoftTypography>{`Latitud: ${address.latitude}`}</SoftTypography>
                                                                            <SoftTypography>{`Longitud: ${address.longitude}`}</SoftTypography>
                                                                            <SoftTypography>{`¿Predeterminada?: ${address.isDefault ? 'Sí' : 'No'}`}</SoftTypography>
                                                                        </Box>
                                                                        <Box sx={{
                                                                            position: 'absolute',
                                                                            bottom: 0,
                                                                            right: 0
                                                                        }}>
                                                                            <IconButton aria-label="delete"
                                                                                        onClick={() => handleDeleteAddress(index)}>
                                                                                <DeleteIcon fontSize="small"/>
                                                                            </IconButton>
                                                                        </Box>
                                                                        {/* Optionally add more details here */}
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </div>
                                                        </Box>
                                                    ))}

                                                </Grid>

                                            </>
                                        )}


                                        <Grid item xs={12}>
                                            <SoftButton

                                                type={"submit"}
                                                variant={"gradient"}
                                                color={"primary"}
                                            >

                                                Actualizar Cliente
                                            </SoftButton>
                                        </Grid>
                                    </Grid>
                                </form>

                            </Stack>
                        </Stack>

                    </Grid>
                </SoftBox>
            </Grid>
        </DashboardLayout>
    );
};
