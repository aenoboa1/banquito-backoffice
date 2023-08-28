import React, {Fragment, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Autocomplete, Grid, InputAdornment, Snackbar, Step, StepLabel, Stepper, TextField,} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import useStateContext from "../../../../context/custom/useStateContext";
import {createAPIEndpoint, ENDPOINTS} from "../../../../api";
import CircularProgress from "@mui/material/CircularProgress";
import {ArrowBack, Business} from "@mui/icons-material";
import MuiAlert from "@mui/material/Alert";
import Portal from '@mui/material/Portal';


const steps = ['1. Busqueda de Clientes', '2. Seleccionar Rol'];
// Schema for the document search form
const documentSchema = yup.object().shape({
    typeDocumentId: yup.string().required("Tipo de Documento es requerido"),
    documentId: yup.string().required("Documento es requerido"),
});

// Schema for the roleId field
const roleIdSchema = yup.object().shape({
    groupRoleId: yup.string().required("Rol es requerido"),
});
const AddMemberForm = ({setIsActive}) => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedClient, setSelectedClient] = useState();

    // error codes
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // or "error"

    // Hook form control for roleId field
    const {
        handleSubmit: handleSubmitRoleId,
        control: controlRoleId,
        formState: {errors: errorsRoleId},
    } = useForm({
        resolver: yupResolver(roleIdSchema),
        defaultValues: {
            groupRoleId: '',
        },
    });

    // Hook form control for document search form
    const {
        handleSubmit: handleSubmitDocument,
        control: controlDocument,
        formState: {errors: errorsDocument},
    } = useForm({
        resolver: yupResolver(documentSchema), // Reuse the same schema
        defaultValues: {
            typeDocumentId: '',
            documentId: '',
        },
    });
    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };


    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
    const {context, setContext} = useStateContext();

    const [openRoles, setOpenRoles] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = openRoles && options.length === 0;

    const [openListClient, setOpenListClient] = useState(false);
    const [optionsClient, setOptionsClient] = useState([]);
    const loadingClient = openListClient && optionsClient.length === 0;

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
            await sleep(1e3);

            if (active) {
                createAPIEndpoint(ENDPOINTS.groupRole).fetchAllRoles({})
                    .then(
                        (res) => {
                            console.log(res.data);
                            setOptions(res.data)
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
        let active = true;
        if (!loadingClient) {
            return undefined;
        }
        (async () => {
            await sleep(1e3);
            if (active) {
                createAPIEndpoint(ENDPOINTS.clients).fetchAllCustomers()
                    .then(
                        (res) => {
                            if (res.data.length > 0) {
                                setOptionsClient(res.data);
                            } else {
                                console.log("No se encontraron clientes.");
                            }
                        })
                    .catch(err => console.log(err));
            }
        })();
        return () => {
            active = false;
        };
    }, [loadingClient]);

    useEffect(() => {
        if (!openRoles) {
            setOptions([]);
        }
    }, [openRoles]);

    useEffect(() => {
        if (!openListClient) {
            setOptionsClient([]);
        }
    }, [openListClient]);


    const documentTypes = [
        {label: 'Cédula', value: 'CID'},
        {label: 'Pasaporte', value: 'PASS'},
        {label: 'RUC', value: 'RUC'},
    ];

    const onSubmit = (data) => {
        if (activeStep === 0) {
            handleNext();
        }
        console.log("selectedClient:", selectedClient); // Debug: Check the value of selectedClient
        const updatedMembers = Array.isArray(context.groupMembers)
            ? [...context.groupMembers, {
                clientName: `${selectedClient?.firstName} ${selectedClient?.lastName}`,
                customerId: selectedClient?.id,
                ...data,
            }]
            : [{
                ...data,
                customerId: selectedClient?.id,
                clientName: `${selectedClient?.firstName} ${selectedClient?.lastName}`
            }];

        console.log("updatedMembers:", updatedMembers); // Debug: Check the value of updatedMembers
        setContext({
            ...context,
            groupMembers: updatedMembers,
        });
    };


    const handleSearchClientFormSubmit = (data) => {
        createAPIEndpoint(ENDPOINTS.clients)
            .fetchByTypeDocumentAndDocumentId(data.typeDocumentId, data.documentId)
            .then((res) => {
                console.log(res.data);

                // Extract firstName and lastName from the API response
                const selectedClientInfo = {
                    id: res.data[0]?.id,
                    firstName: res.data[0]?.firstName,
                    lastName: res.data[0]?.lastName,
                };
                setSelectedClient(selectedClientInfo);

                // Move to the next step
                if (selectedClientInfo.firstName && selectedClientInfo.lastName) {
                    setActiveStep(1);
                } else {
                    setOpenSnackbar(true);
                    setSnackbarMessage("No se encontró el cliente.");
                    setSnackbarSeverity("error");
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };


    return (
        <div>

            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => (
                    <Step key={label} completed={activeStep > index}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>


            <form onSubmit={handleSubmitDocument(handleSearchClientFormSubmit)}>
                {activeStep === 0 && (
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                        <Box gridColumn="span 12">
                            {/* Type of Document */}
                            <Controller
                                name="typeDocumentId"
                                control={controlDocument}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        select // tell TextField to render select
                                        label="Tipo de Documento"
                                        error={Boolean(errorsDocument.typeDocumentId)}
                                        helperText={errorsDocument.typeDocumentId?.message}
                                    >
                                        {documentTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Box>
                        <Box gridColumn="span 12">
                            <Controller
                                name="documentId"
                                control={controlDocument}
                                defaultValue=""
                                render={({field}) => (
                                    <TextField
                                        fullWidth
                                        label="Documento de Identidad"
                                        variant="outlined"
                                        {...field}
                                        error={!!errorsDocument.documentId}
                                        helperText={errorsDocument.documentId?.message}
                                    />
                                )}
                            />
                        </Box>


                        <Box gridColumn="span 12" sx={{textAlign: 'center'}}>
                            <Button type="button" variant="contained" color="primary"
                                    onClick={handleSubmitDocument(handleSearchClientFormSubmit)}>
                                >
                                Buscar
                            </Button>
                        </Box>
                    </Box>
                )}
            </form>


            {activeStep === 1 && (
                <form onSubmit={handleSubmitRoleId(onSubmit)}>
                    <Box display="grid" gridTemplateColumns="repeat(12, 2fr)" gap={4}>
                        <Box gridColumn="span 12">
                            <SoftTypography align="center">
                                <span
                                    style={{fontWeight: 'bold'}}>Cliente Seleccionado:</span> {selectedClient?.firstName} {selectedClient?.lastName}
                            </SoftTypography>
                        </Box>

                        <Box gridColumn="span 12">
                            <Grid item xs={12}>

                            </Grid>
                        </Box>
                        <Box gridColumn="span 12">
                            <Grid item xs={12}>
                                <Controller
                                    name="groupRoleId"
                                    control={controlRoleId}
                                    render={({field}) => (
                                        <Autocomplete
                                            id="groupRoleId"
                                            open={openRoles}
                                            onOpen={() => {
                                                setOpenRoles(true);
                                            }}
                                            onClose={() => {
                                                setOpenRoles(false);
                                            }}

                                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                                            getOptionLabel={(option) => option.groupRoleName || ''}
                                            groupBy={(option) => option.firstLetter}
                                            fullWidth
                                            options={options}
                                            loading={loading}
                                            loadingText={"Cargando roles..."}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Selecciona un rol"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        endAdornment: (
                                                            <Fragment>
                                                                {loading ? <CircularProgress color="inherit"
                                                                                             size={20}/> : null}
                                                                {params.InputProps.endAdornment}
                                                            </Fragment>
                                                        ),
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Business/>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    error={Boolean(errorsRoleId.groupRoleId)}
                                                    helperText={errorsRoleId.groupRoleId?.message}
                                                />
                                            )}
                                            onChange={(_event, data) => field.onChange(data?.id ?? '')}
                                        />
                                    )}
                                />
                            </Grid>
                        </Box>

                        <Box gridColumn="span 12">

                            <Box gridColumn="span 5">
                                <Button color="primary" variant="contained" fullWidth type="button"
                                        onClick={handleSubmitRoleId(onSubmit)}>
                                    Agregar Miembro
                                </Button>
                            </Box>

                            <Box gridColumn="span 5">
                                <Button
                                    color="secondary" // Use a secondary color for the back button
                                    variant="contained"
                                    startIcon={<ArrowBack/>} // Add back arrow icon
                                    fullWidth
                                    onClick={handleBack} // Call handleBack function
                                >
                                    Volver
                                </Button>
                            </Box></Box>

                    </Box>
                </form>
            )}

            <Portal>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={() => setOpenSnackbar(false)}
                        severity={snackbarSeverity}
                    >
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </Portal>

        </div>
    );
};

export default AddMemberForm;
