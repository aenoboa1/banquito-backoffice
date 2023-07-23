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
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';

const validationSchema = yup.object({
    firstName: yup.string().required('Primer Nombre es requerido'),
    lastName: yup.string().required('Segundo Nombre es requerido'),
    emailAddress: yup
        .string()
        .email('Introduzca un email válido')
        .required('Email es requerido'),
    gender: yup.string().required('Seleccione un género'), // Add gender validation
    typeDocumentId: yup.string().required('Seleccione un tipo de documento'),
    birthDate: yup.date().required('Fecha de nacimiento es requerida'), // Step 2: Add birthDate validation
    documentId: yup.string().required('Documento de identidad es requerido'),
    branchId: yup.string().required('Id de la Branch es requerido'), // WARNING FOR TESTING ONLY
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
            typeDocumentId: '',
            birthDate: new Date(),
            documentId: '',
            branchId: '',
            comments: '',
        },
    });

    const onSubmit = (data) => {

        const updatedcontext = {
            addresses: [...context.addresses],
            phones: [...context.phones],
            ...data
        };

        console.log(updatedcontext);
        createAPIEndpoint(ENDPOINTS.accounts,
        ).post(updatedcontext, {}).then(

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

    const genderTypes = [
        {label: 'Masculino', value: 'M'},
        {label: 'Femenino', value: 'F'},
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
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.gender)}
                                    helperText={errors.gender?.message}
                                >
                                    {genderTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="typeDocumentId"
                            control={control}
                            render={({field}) => (
                                <Select
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.typeDocumentId)}
                                    helperText={errors.typeDocumentId?.message}
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
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    control={control}
                                    name='birthDate'
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
                        </div>
                    </Box>

                    <Box gridColumn="span 12">
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
                                />
                            )}
                        />
                    </Box>

                    {/*WARNING FOR TESTING ONLY */}
                    <Box gridColumn="span 12">
                        <Controller
                            name="branchId"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="branchId"
                                    label="Id de la Branch (TEST)"
                                    {...field}
                                    error={Boolean(errors.branchId)}
                                    helperText={errors.branchId?.message}
                                />
                            )}
                        />
                    </Box>

                    {/*WARNING FOR TESTING ONLY */}
                    <Box gridColumn="span 12">
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
                                    error={Boolean(errors.branchId)}
                                    helperText={errors.branchId?.message}
                                />
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


                    {context.phones && (
                        <>
                            {context.phones.map((phone, index) => (
                                <Box gridColumn="span 12">
                                    <SoftTypography align="center" sx={{fontWeight: 'bold'}}>
                                        Teléfono Agregado
                                    </SoftTypography>
                                    <Box>
                                        <SoftTypography>{`Número: ${phone.phoneNumber}`}</SoftTypography>
                                        <SoftTypography>{`Tipo: ${phone.phoneType}`}</SoftTypography>
                                        <SoftTypography>{`Predeterminado: ${phone.isDefault}`}</SoftTypography>
                                    </Box>
                                </Box>

                            ))}
                        </>

                    )}

                    {context.addresses && (
                        <>
                            {context.addresses.map((address, index) => (
                                <Box key={index} gridColumn="span 12">
                                    <SoftTypography align="center" sx={{fontWeight: 'bold'}}>
                                        Dirección {index + 1}
                                    </SoftTypography>
                                    <Box>
                                        <SoftTypography>{`Tipo de Dirección: ${address.typeAddress}`}</SoftTypography>
                                        <SoftTypography>{`Dirección Línea 1: ${address.line1}`}</SoftTypography>
                                        <SoftTypography>{`Dirección Línea 2: ${address.line2}`}</SoftTypography>
                                        <SoftTypography>{`Latitud: ${address.latitude}`}</SoftTypography>
                                        <SoftTypography>{`Longitud: ${address.longitude}`}</SoftTypography>
                                        <SoftTypography>{`¿Predeterminada?: ${address.isDefault ? 'Sí' : 'No'}`}</SoftTypography>
                                    </Box>
                                </Box>
                            ))}
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

