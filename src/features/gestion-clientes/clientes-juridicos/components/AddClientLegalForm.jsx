import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createAPIEndpoint, ENDPOINTS } from "../../../../api";
import useStateContext from "../../../../context/custom/useStateContext";
import AddMemberForm from './AddMembers';

const validationSchema = yup.object({
    groupName: yup.string().required('Primer Nombre es requerido'),
    emailAddress: yup
        .string()
        .email('Introduzca un email válido')
        .required('Email es requerido'),
    branchId: yup.string().required('Id de la Branch es requerido'), // WARNING FOR TESTING ONLY
    locationId: yup.string().required('Id de Location es requerido'), // WARNING FOR TESTING ONLY
    phoneNumber: yup.string().required('Número telefónico requerido'),
    line1: yup.string().required('Línea 1 es requerido'),
    line2: yup.string().required('Línea 2 es requerido'),
    latitude: yup.string().required('Latitud es requerida'),
    longitude: yup.string().required('Longitud es requerida'),
    roleType: yup.string().required('Seleccione un rol'),
    clientId: yup.string().required('Seleccione un cliente'),
});

export const AddClientLegalForm = () => {
    const [isActive, setIsActive] = useState(true);
    const { context, setContext } = useStateContext();
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            branchId: '',
            locationId: '',
            groupName: '',
            emailAddress: '',
            phoneNumber: '',
            line1: '',
            line2: '',
            latitude: '',
            longitude: '',
            comments: '',
            roleType: '',
            clientId: '',
        },
    });

    const onSubmit = (data) => {

        const updatedcontext = {
            members: [...context.members],
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

    const roleType = [
        { label: 'Seleccione un rol...', value: '' },
        { label: 'Representante legal', value: 'CID' },
        { label: 'Accionista', value: 'PASS' },
        { label: 'Apoderado', value: 'RUC' },
    ];

    const clientList = [
        { label: 'Seleccione un cliente', value: '' },
        { label: 'Cliente 1', value: 'CID' },
    ];

    const [openAddress, setOpenAddress] = React.useState(false);
    const handleOpenAddress = () => setOpenAddress(true);


    const handleCloseAddress = () => setOpenAddress(false);

    const [open, setOpen] = React.useState(false);
    const ha = () => {

    }
    const handleOpen = () => {
        setIsActive(false);
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    // Function to add a new phone number field

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Añadir Empresa
                        </SoftTypography>
                    </Box>

                    {/*WARNING FOR TESTING ONLY */}
                    <Box gridColumn="span 6">
                        <Controller
                            name="branchId"
                            control={control}
                            render={({ field }) => (
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
                    <Box gridColumn="span 6">
                        <Controller
                            name="locationId"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="locationId"
                                    label="Id de la localización (TEST)"
                                    {...field}
                                    error={Boolean(errors.locationId)}
                                    helperText={errors.locationId?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="groupName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="groupName"
                                    label="Nombre de Grupo"
                                    {...field}
                                    error={Boolean(errors.groupName)}
                                    helperText={errors.groupName?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 6">
                        <Controller
                            name="emailAddress"
                            control={control}
                            render={({ field }) => (
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

                    <Box gridColumn="span 6">
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="phoneNumber"
                                    label="Número Telefónico"
                                    {...field}
                                    error={Boolean(errors.phoneNumber)}
                                    helperText={errors.phoneNumber?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 6">
                        <Controller
                            name="line1"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="line1"
                                    label="Línea 1"
                                    {...field}
                                    error={Boolean(errors.line1)}
                                    helperText={errors.line1?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 6">
                        <Controller
                            name="line2"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="line2"
                                    label="Línea 2"
                                    {...field}
                                    error={Boolean(errors.line2)}
                                    helperText={errors.line2?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 6">
                        <Controller
                            name="latitude"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="latitude"
                                    label="Latitud"
                                    {...field}
                                    error={Boolean(errors.latitude)}
                                    helperText={errors.latitude?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 6">
                        <Controller
                            name="longitude"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="longitude"
                                    label="Longitud"
                                    {...field}
                                    error={Boolean(errors.longitude)}
                                    helperText={errors.longitude?.message}
                                />
                            )}
                        />
                    </Box>

                    {/*WARNING FOR TESTING ONLY */}
                    <Box gridColumn="span 12">
                        <Controller
                            name="comments"
                            control={control}
                            render={({ field }) => (
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
                                Agregar miembros
                            </Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{ backdropFilter: "blur(5px)" }}
                            >
                                <Box sx={style}>
                                    <AddMemberForm />
                                </Box>
                            </Modal>
                        </div>
                    </Box>

                    {
                        context.members && (
                            <>
                                {context.members.map((phone, index) => (
                                    <Box gridColumn="span 12">
                                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                                            Miembro Agregado
                                        </SoftTypography>
                                        <Box>
                                            <SoftTypography>{`Número: ${phone.phoneNumber}`}</SoftTypography>
                                            <SoftTypography>{`Tipo: ${phone.phoneType}`}</SoftTypography>
                                            <SoftTypography>{`Predeterminado: ${phone.isDefault}`}</SoftTypography>
                                        </Box>
                                    </Box>
                                ))}
                            </>
                        )
                    }

                    <Box gridColumn="span 12">
                        <Button color="primary" variant="contained" fullWidth type="submit"
                            disabled={isActive}
                        >
                            Crear
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};

