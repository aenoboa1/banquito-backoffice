import React, { Fragment, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
    Accordion, AccordionDetails, AccordionSummary, Autocomplete, ButtonGroup,
    IconButton, InputAdornment, Modal, TextField
} from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { createAPIEndpoint, ENDPOINTS } from "../../../../api";
import useStateContext from "../../../../context/custom/useStateContext";
import AddMemberForm from './AddMembers';
import {
    AddCircleOutline, Email, ContactPhone, Comment, LocalPhone, Group, AddLocation, ExpandMore, Business,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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

    const [openBranches, setOpenBranches] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = openBranches && options.length === 0;

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

    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    useEffect(() => {
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
                        console.log("BRANCH",res.data);
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

    useEffect(() => {
        if (!openBranches) {
            setOptions([]);
        }
    }, [openBranches]);

    const onSubmit = (data) => {

        const updatedcontext = {
            members: Array.isArray(context.members) ? [...context.members] : [],
            ...data
        };

        console.log(updatedcontext);
        // alert(updatedcontext);

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

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => {
        setOpen(true);
        setIsActive(true);
    }
    const handleClose = () => setOpen(false);

    const handleDeleteMember = (index) => {
        const updatedMembers = context.members.filter((_, i) => i !== index);
        const updatedContext = {
            ...context,
            members: updatedMembers,
        };
        setContext(updatedContext);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Añadir Empresa
                        </SoftTypography>
                    </Box>

                    <Box gridColumn="span 6">
                        <Controller
                            name="branchId"
                            control={control}
                            render={({ field }) => (
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
                                                    <Fragment>
                                                        {loading ?
                                                            <CircularProgress color="inherit"
                                                                size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </Fragment>
                                                ),
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Business />
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Group />
                                            </InputAdornment>
                                        ),
                                    }}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Email />
                                            </InputAdornment>
                                        ),
                                    }}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <ContactPhone />
                                            </InputAdornment>
                                        ),
                                    }}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocalPhone />
                                            </InputAdornment>
                                        ),
                                    }}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocalPhone />
                                            </InputAdornment>
                                        ),
                                    }}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AddLocation />
                                            </InputAdornment>
                                        ),
                                    }}
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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AddLocation />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Box>

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
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Comment />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <div>
                            <Button onClick={handleOpen} variant="contained"
                                startIcon={<AddCircleOutline />}>
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
                                    <AddMemberForm setIsActive={setIsActive} />
                                </Box>
                            </Modal>
                        </div>
                    </Box>

                    <Box gridColumn="span 12">
                        {context.members && (
                            <>
                                {context.members.map((member, index) => (
                                    <Box gridColumn="span 6">
                                        <div>
                                            <Accordion key={index}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMore />}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <Box sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(12, 1fr)',
                                                        gap: 4
                                                    }}>
                                                        <Box gridColumn="span 6"
                                                            sx={{ position: 'relative' }}>
                                                            <SoftTypography align="center"
                                                                sx={{ fontWeight: 'bold' }}>
                                                                Miembro {index + 1}
                                                            </SoftTypography>
                                                        </Box>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Box>
                                                        <SoftTypography>
                                                            {`Cliente: ${member.clientList}`}
                                                        </SoftTypography>
                                                        <SoftTypography>
                                                            {`Rol: ${member.roleType}`}
                                                        </SoftTypography>
                                                    </Box>
                                                    <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>

                                                        <ButtonGroup variant="outlined"
                                                            aria-label="outlined button group">

                                                            <IconButton aria-label="delete"
                                                                onClick={() => handleDeleteMember(index)}>
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>

                                                            <IconButton aria-label="edit">
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                        </ButtonGroup>
                                                    </Box>
                                                    {/* Optionally add more details here */}
                                                </AccordionDetails>
                                            </Accordion>
                                        </div>
                                    </Box>
                                ))}
                            </>
                        )}
                    </Box>

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

