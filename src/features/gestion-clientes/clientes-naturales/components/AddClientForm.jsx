import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Modal, Select, TextField} from '@mui/material';
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

const validationSchema = yup.object({
    firstName: yup.string().required('Primer Nombre es requerido'),
    lastName: yup.string().required('Segundo Nombre es requerido'),
    emailAddress: yup
        .string()
        .email('Introduzca un email válido')
        .required('Email es requerido'),
    gender: yup.string().required('Seleccione un género'), // Add gender validation
    typeDocument: yup.string().required('Seleccione un tipo de documento'),
});

export const AddClientForm = () => {

    const {context, setContext} = useStateContext();
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            gender: '', // Add default value for gender
            typeDocument: '',
        },
    });

    const onSubmit = (data) => {

        const updatedcontext = { ...context, ...data };

        console.log(updatedcontext);
        createAPIEndpoint(ENDPOINTS.accounts,
        ).post(data, {}).then(

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

    const phoneTypes = [
        {label: 'Seleccione un tipo de documento...', value: ''},
        {label: 'Cédula', value: 'CID'},
        {label: 'Pasaporte', value: 'PASS'},
        {label: 'RUC', value: 'RUC'},
    ];


    const [openAddress, setOpenAddress] = React.useState(false);
    const handleOpenAddress = () => setOpenAddress(true);


    const handleCloseAddress = () => setOpenAddress(false);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Function to add a new phone number field

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{fontWeight: 'bold'}}>
                            Añadir Cliente
                        </SoftTypography>
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="firstName"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="firstName"
                                    label="Primer Nombre"
                                    {...field}
                                    error={Boolean(errors.firstName)}
                                    helperText={errors.firstName?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="lastName"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="lastName"
                                    label="Segundo Nombre"
                                    {...field}
                                    error={Boolean(errors.lastName)}
                                    helperText={errors.lastName?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
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
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="gender"
                            control={control}
                            render={({field}) => (
                                <Select
                                    fullWidth
                                    native
                                    id="gender"
                                    {...field}
                                    error={Boolean(errors.gender)}
                                    helperText={errors.gender?.message}
                                >
                                    <option value="">Seleccione el género...</option>
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </Select>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="typeDocument"
                            control={control}
                            render={({field}) => (
                                <Select
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.typeDocument)}
                                    helperText={errors.typeDocument?.message}
                                >
                                    {phoneTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Box>


                    <Box gridColumn="span 12">
                        <div>
                            <Button onClick={handleOpen} variant="contained">
                                Añadir Telefono
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
                        </div>
                    </Box>

                    {context.phoneNumber && context.phoneType && (
                        <>
                            <Box gridColumn="span 12">
                                <SoftTypography align="center" sx={{fontWeight: 'bold'}}>
                                    Teléfono Agregado
                                </SoftTypography>
                                <Box>
                                    <SoftTypography>{`Número: ${context.phoneNumber}`}</SoftTypography>
                                    <SoftTypography>{`Tipo: ${context.phoneType}`}</SoftTypography>
                                    <SoftTypography>{`Predeterminado: ${context.isDefault}`}</SoftTypography>
                                </Box>
                            </Box>
                        </>
                    )}

                    {context.typeAddress && (
                        <>
                            <Box gridColumn="span 12">
                                <SoftTypography align="center" sx={{fontWeight: 'bold'}}>
                                    Dirección Agregada
                                </SoftTypography>
                                <Box>
                                    <SoftTypography>Tipo de Dirección: {context.typeAddress}</SoftTypography>
                                    <SoftTypography>Dirección Línea 1: {context.line1}</SoftTypography>
                                    <SoftTypography>Dirección Línea 2: {context.line2}</SoftTypography>
                                    <SoftTypography>Latitud: {context.latitude}</SoftTypography>
                                    <SoftTypography>Longitud: {context.longitude}</SoftTypography>
                                    <SoftTypography>¿Predeterminada?: {context.isDefault ? 'Sí' : 'No'}</SoftTypography>
                                </Box>
                            </Box>
                        </>
                    )}


                    <Box gridColumn="span 12">
                        <div>
                            <Button onClick={handleOpenAddress} variant="contained">
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
                    </Box>

                    <Box gridColumn="span 12">
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Crear
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};

