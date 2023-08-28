import React, {Fragment, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Autocomplete, ButtonGroup, IconButton, InputAdornment, Modal, Snackbar, TextField} from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {createAPIEndpoint, createAPIEndpointProducts, ENDPOINTS} from "../../../../api";
import useStateContext from "../../../../context/custom/useStateContext";
import {
    AccountCircle,
    AddCircleOutline,
    AddLocation,
    BlockOutlined,
    Business,
    CheckCircleOutline,
    Comment,
    ContactPhone,
    Email,
    ErrorOutline,
    GpsFixed,
    Group,
    LocationOn,
} from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from "@mui/icons-material/Edit";
import SoftButton from 'components/SoftButton';
import Grid from "@mui/material/Grid";
import {useLocation} from "react-router-dom";
import DashboardNavbar from "../../../../examples/Navbars/DashboardNavbar";
import SoftBox from "../../../../components/SoftBox";
import DashboardLayout from "../../../../examples/LayoutContainers/DashboardLayout";
import MenuItem from "@mui/material/MenuItem";
import ClientRepresentativeForm from "./ClientRepresentativeForm";
import {DataGrid} from "@mui/x-data-grid";
import {useRefresh} from "../../../../context/custom/useRefreshContext";
import Chip from "@mui/material/Chip";
import MuiAlert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const validationSchema = yup.object({
    groupName: yup.string().required('Nombre del Grupo es requerido'),
    emailAddress: yup
        .string()
        .email('Introduzca un email válido')
        .required('Email es requerido'),
    branchId: yup.string().required('Seleccione una sucursal'),
    locationId: yup.string().required('Seleccione un cantón'),
    phoneNumber: yup.string().required('Número telefónico requerido'),
    line1: yup.string().required('Línea 1 es requerido'),
    line2: yup.string().required('Línea 2 es requerido'),
    documentId: yup
        .string()
        .required('Documento de identidad es requerido')
        .length(13, 'Documento de identidad debe tener 13 caracteres'),
    latitude: yup.string().required('Latitud es requerida'),
    longitude: yup.string().required('Longitud es requerida'),
    comments: yup.string().required('Agregue un comentario'),
    state: yup.string().required('Seleccione un estado'),
});
export const UpdateLegalClientForm = () => {
    const [isActive, setIsActive] = useState(true);
    const {context, setContext} = useStateContext();
    const [openBranches, setOpenBranches] = useState(false);
    const [optionsBranches, setOptionsBranches] = useState([]);
    const loadingSelectBranches = openBranches && optionsBranches.length === 0;
    const [openLocations, setOpenLocations] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = openLocations && options.length === 0;
    const [includeAccount, setIncludeAccount] = useState(false);
    // ACCOUNT PART
    const [productOptions, setProductOptions] = useState([]);
    const [openProducts, setOpenProducts] = useState(false);
    const loadingProducts = openProducts && options.length === 0;
    const {state} = useLocation();
    const [companyData, setCompanyData] = useState(state.data);
    const refresh = useRefresh();

    const [Branch, setBranch] = useState();
    const [groupMembers, setGroupMembers] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const rowId = companyData.id; // Assuming your data structure has an 'id' property
        createAPIEndpoint(ENDPOINTS.groupCompany)
            .fetchGroupCompanyById(rowId)
            .then((res) => {
                const groupMembersFromApi = res.data.groupMembers; // Adjust the property name if needed
                setGroupMembers(groupMembersFromApi);
            })
            .catch((err) => console.log(err));
    }, [companyData, refreshKey]);


    useEffect(() => {
        // Listen for the refresh signal from context
        setRefreshKey((prevKey) => prevKey + 1);
    }, [refresh]);

    const stateTypes = [{label: 'Activo', value: 'ACT'}, {label: 'Inactivo', value: 'INA'}, {
        label: 'Suspendido',
        value: 'SUS'
    }];

    const stateOptions = [{value: 'ACT', label: 'Activo'}, {value: 'INA', label: 'Inactivo'}, {
        value: 'SUS',
        label: 'Suspendido'
    }, {value: 'BLO', label: 'Bloqueado'},];

    const getStateChipColor = (stateValue) => {
        switch (stateValue) {
            case 'ACT':
                return 'success';
            case 'INA':
            case 'SUS':
            case 'BLO':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStateIcon = (stateValue) => {
        switch (stateValue) {
            case 'ACT':
                return <CheckCircleOutline/>;
            case 'INA':
            case 'SUS':
            case 'BLO':
                return <BlockOutlined/>;
            default:
                return <ErrorOutline/>;
        }
    };
    useEffect(() => {
        setContext({
            ...context, groupCompanyId: companyData.id,
        });
        createAPIEndpoint(ENDPOINTS.bankEntity).fetchBranchByUQ(companyData.branchId, {}).then(res => {
            console.log(res.data);
            setBranch(res.data.name)
        }).then(err => console.log(err))

    }, []);

    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    useEffect(() => {
        let active = true;
        if (!loadingSelectBranches) {
            return undefined;
        }
        (async () => {
            await sleep(1e3); // For demo purposes.
            if (active) {
                createAPIEndpoint(ENDPOINTS.bankEntity).fetchBranches('64b1892b9c2c3b03c33a736f', {}).then(res => {
                    setOptionsBranches(res.data);
                }).then(err => console.log(err))
            }
        })();
        return () => {
            active = false;
        };
    }, [loadingSelectBranches]);

    useEffect(() => {
        let active = true;
        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3);
            if (active) {
                createAPIEndpoint(ENDPOINTS.geoStructure).fetchProvinceByCountry('ECU', '2').then((res) => {
                    setOptions(res.data.locations)
                }).then(err => console.log(err))
            }
        })();
        return () => {
            active = false;
        };
    }, [loading]);

    useEffect(() => {
        if (!openBranches) {
            setOptionsBranches([]);
        }
    }, [openBranches]);

    useEffect(() => {
        if (!openLocations) {
            setOptions([]);
        }
    }, [openLocations]);

    // PRODUCT ACCOUNT USE EFFECT

    useEffect(() => {
        let active = true;
        if (!loadingProducts) {
            return undefined;
        }

        (async () => {
            await sleep(1e3);
            if (active) {
                createAPIEndpointProducts(ENDPOINTS.productAccount).fetchAll({}).then(res => {
                    console.log(res.data);
                    setProductOptions(res.data);
                }).then(err => console.log(err))
            }
        })()
    });

    useEffect(() => {
        if (!openProducts) {
            setProductOptions([]);
        }
    }, [openProducts]);

    const {
        control, handleSubmit, formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema), defaultValues: {
            branchId: companyData?.branchId || '',
            locationId: companyData?.locationId || '',
            groupName: companyData?.groupName || '',
            emailAddress: companyData?.emailAddress || '',
            phoneNumber: companyData?.phoneNumber || '',
            documentId: companyData?.documentId || '',
            line1: companyData?.line1 || '',
            line2: companyData?.line2 || '',
            latitude: companyData?.latitude || '',
            longitude: companyData?.longitude || '',
            comments: companyData?.comments || '',
            state: companyData?.state || '',
        },
    });

    const [roleOptions, setRoleOptions] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);

    useEffect(() => {
        // Fetch group company roles
        createAPIEndpoint(ENDPOINTS.groupRole)
            .fetchAllRoles({})
            .then((res) => {
                console.log(res.data);
                setRoleOptions(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        // Fetch all customers
        createAPIEndpoint(ENDPOINTS.clients)
            .fetchAllCustomers({})
            .then((res) => {
                console.log(res.data);
                setCustomerOptions(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);
    const onSubmit = (data) => {
        console.log(context.groupMembers);
        const updatedcontext = {
            groupMembers: Array.isArray(context.groupMembers) ? [...context.groupMembers] : [], ...data,
            id: companyData.id, // Append the company ID to the data
        };
        createAPIEndpoint(ENDPOINTS.groupCompany,).putCompany(updatedcontext, {}).then(
        ).catch(err => console.log(err))
    };


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

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
        setIsActive(true);
    }
    const handleClose = () => setOpen(false);

    const handleDeleteMember = (index) => {
        const updatedMembers = context.groupMembers.filter((_, i) => i !== index);
        const updatedContext = {
            ...context, groupMembers: updatedMembers,
        };
        setContext(updatedContext);
    };

    // error codes
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // or "error"
    const [expanded, setExpanded] = useState(false);

    return (


        <DashboardLayout>
            <DashboardNavbar/>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <SoftBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="90vh"
                    >
                        <Grid item xs={6.3}>
                            <Stack gap={5}>
                                <Stack spacing={2} alignItems="center">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Grid container spacing={4}>
                                            <Grid item xs={12}>
                                                <Controller
                                                    name="branchId"
                                                    control={control}
                                                    render={({field}) => (<Autocomplete
                                                        id="branchId"
                                                        open={openBranches}
                                                        onOpen={() => {
                                                            setOpenBranches(true);
                                                        }}
                                                        onClose={() => {
                                                            setOpenBranches(false);
                                                        }}
                                                        isOptionEqualToValue={(option, value) => option.uniqueKey === value?.uniqueKey}
                                                        getOptionSelected={(option, value) => value === undefined || value === "" || option.uniqueKey === value.uniqueKey}
                                                        getOptionLabel={(option) => option.name || Branch}
                                                        fullWidth
                                                        options={optionsBranches}
                                                        loading={loadingSelectBranches}
                                                        loadingText={"Cargando sucursales..."}
                                                        renderInput={(params) => (<TextField
                                                            {...params}
                                                            label="Seleccione una Sucursal"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (<Fragment>
                                                                    {loadingSelectBranches ?
                                                                        <CircularProgress color="inherit"
                                                                                          size={20}/> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </Fragment>),
                                                                startAdornment: (<InputAdornment position="start">
                                                                    <Business/>
                                                                </InputAdornment>),
                                                            }}
                                                            error={Boolean(errors.branchId)}
                                                            helperText={errors.branchId?.message}
                                                        />)}
                                                        onChange={(_event, data) => field.onChange(data?.uniqueKey ?? '')}
                                                    />)}
                                                />
                                            </Grid>


                                            <Grid item xs={12}>
                                                <Controller
                                                    name="locationId"
                                                    control={control}
                                                    render={({field}) => (<Autocomplete
                                                        id="locationId"
                                                        open={openLocations}
                                                        onOpen={() => {
                                                            setOpenLocations(true);
                                                        }}
                                                        onClose={() => {
                                                            setOpenLocations(false);
                                                        }}

                                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                        getOptionLabel={(option) => option.name || ''}
                                                        groupBy={(option) => option.firstLetter}

                                                        fullWidth
                                                        options={options}
                                                        loading={loading}
                                                        loadingText={"Cargando localizaciones..."}
                                                        renderInput={(params) => (<TextField
                                                            {...params}
                                                            label="Selecciona un cantón"
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (<React.Fragment>
                                                                    {loading ? <CircularProgress color="inherit"
                                                                                                 size={20}/> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </React.Fragment>),
                                                                startAdornment: (<InputAdornment position="start">
                                                                    <AddLocation/>
                                                                </InputAdornment>),
                                                            }}
                                                            error={Boolean(errors.locationId)}
                                                            helperText={errors.locationId?.message}
                                                        />)}
                                                        onChange={(_event, data) => field.onChange(data?.id ?? '')}
                                                    />)}
                                                />
                                            </Grid>


                                            <Grid item xs={12}>
                                                <Controller
                                                    name="groupName"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        fullWidth
                                                        type="text"
                                                        id="groupName"
                                                        label="Nombre de Grupo"
                                                        {...field}
                                                        error={Boolean(errors.groupName)}
                                                        helperText={errors.groupName?.message}
                                                        InputProps={{
                                                            startAdornment: (<InputAdornment position="start">
                                                                <Group/>
                                                            </InputAdornment>),
                                                        }}
                                                    />)}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Controller
                                                    name="emailAddress"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        fullWidth
                                                        type="text"
                                                        id="emailAddress"
                                                        label="Email"
                                                        {...field}
                                                        error={Boolean(errors.emailAddress)}
                                                        helperText={errors.emailAddress?.message}
                                                        InputProps={{
                                                            startAdornment: (<InputAdornment position="start">
                                                                <Email/>
                                                            </InputAdornment>),
                                                        }}
                                                    />)}
                                                />
                                            </Grid>


                                            <Grid item xs={12}>
                                                {/* Document ID */}
                                                <Controller
                                                    name="documentId"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        fullWidth
                                                        type="text"
                                                        id="documentId"
                                                        label="Documento de Identidad"
                                                        {...field}
                                                        error={Boolean(errors.documentId)}
                                                        helperText={errors.documentId?.message}
                                                        InputProps={{
                                                            startAdornment: (<InputAdornment position="start">
                                                                <AccountCircle/>
                                                            </InputAdornment>),
                                                        }}
                                                    />)}
                                                />
                                            </Grid>


                                            <Grid item xs={12}>
                                                <Controller
                                                    name="phoneNumber"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        fullWidth
                                                        type="text"
                                                        id="phoneNumber"
                                                        label="Número Telefónico"
                                                        {...field}
                                                        error={Boolean(errors.phoneNumber)}
                                                        helperText={errors.phoneNumber?.message}
                                                        InputProps={{
                                                            startAdornment: (<InputAdornment position="start">
                                                                <ContactPhone/>
                                                            </InputAdornment>),
                                                        }}
                                                    />)}
                                                />
                                            </Grid>


                                            <Grid item xs={12}>
                                                <Controller
                                                    name="line1"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        fullWidth
                                                        type="text"
                                                        id="line1"
                                                        label="Línea 1"
                                                        {...field}
                                                        error={Boolean(errors.line1)}
                                                        helperText={errors.line1?.message}
                                                        InputProps={{
                                                            startAdornment: (<InputAdornment position="start">
                                                                <LocationOn/>
                                                            </InputAdornment>),
                                                        }}
                                                    />)}
                                                />
                                            </Grid>


                                            <Grid item xs={12}>
                                                <Controller
                                                    name="line2"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        fullWidth
                                                        type="text"
                                                        id="line2"
                                                        label="Línea 2"
                                                        {...field}
                                                        error={Boolean(errors.line2)}
                                                        helperText={errors.line2?.message}
                                                        InputProps={{
                                                            startAdornment: (<InputAdornment position="start">
                                                                <LocationOn/>
                                                            </InputAdornment>),
                                                        }}
                                                    />)}
                                                />
                                            </Grid>


                                            <Grid item xs={12}>
                                                <Controller
                                                    name="latitude"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        fullWidth
                                                        type="text"
                                                        id="latitude"
                                                        label="Latitud"
                                                        {...field}
                                                        error={Boolean(errors.latitude)}
                                                        helperText={errors.latitude?.message}
                                                        InputProps={{
                                                            startAdornment: (<InputAdornment position="start">
                                                                <GpsFixed/>
                                                            </InputAdornment>),
                                                        }}
                                                    />)}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Controller
                                                    name="longitude"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        fullWidth
                                                        type="text"
                                                        id="longitude"
                                                        label="Longitud"
                                                        {...field}
                                                        error={Boolean(errors.longitude)}
                                                        helperText={errors.longitude?.message}
                                                        InputProps={{
                                                            startAdornment: (<InputAdornment position="start">
                                                                <GpsFixed/>
                                                            </InputAdornment>),
                                                        }}
                                                    />)}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Controller
                                                    name="comments"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        fullWidth
                                                        type="text"
                                                        id="comments"
                                                        label="Comentario"
                                                        {...field}
                                                        error={Boolean(errors.comments)}
                                                        helperText={errors.comments?.message}
                                                        InputProps={{
                                                            startAdornment: (<InputAdornment position="start">
                                                                <Comment/>
                                                            </InputAdornment>),
                                                        }}
                                                    />)}
                                                />
                                            </Grid>


                                            <Grid item xs={12}>
                                                <Controller
                                                    name="state"
                                                    control={control}
                                                    render={({field}) => (<TextField
                                                        {...field}
                                                        fullWidth
                                                        select // tell TextField to render select
                                                        label="Estado"
                                                        error={Boolean(errors.state)}
                                                        helperText={errors.state?.message}
                                                    >
                                                        {stateTypes.map((type) => (
                                                            <MenuItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </MenuItem>))}
                                                    </TextField>)}
                                                />
                                            </Grid>


                                            <Grid item xs={12}>
                                                <SoftButton color={"primary"} variant={"contained"} fullWidth
                                                            type={"submit"}
                                                >
                                                    Actualizar Empresa
                                                </SoftButton>
                                            </Grid>


                                            <Grid item xs={12}>
                                                <Button onClick={handleOpen} variant="contained"
                                                        startIcon={<AddCircleOutline/>}>
                                                    Agregar miembros
                                                </Button>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <Grid item xs={12}>

                                                    <div>
                                                        <Modal
                                                            open={open}
                                                            onClose={handleClose}
                                                            aria-labelledby="modal-modal-title"
                                                            aria-describedby="modal-modal-description"
                                                            style={{backdropFilter: "blur(5px)"}}
                                                        >
                                                            <Box sx={style}>
                                                                <ClientRepresentativeForm setIsActive={setIsActive}
                                                                                          onClose={handleClose}/>
                                                            </Box>
                                                        </Modal>
                                                    </div>
                                                </Grid>

                                                <div style={{height: "400px", width: "100%"}}> {/* Adjust the height */}
                                                    <DataGrid
                                                        autoPageSize
                                                        rows={groupMembers}
                                                        columns={[

                                                            {
                                                                field: "customerId",
                                                                headerName: "Cliente",
                                                                flex: 2,
                                                                valueGetter: (params) => {
                                                                    const customerId = params.value;
                                                                    const customer = customerOptions.find((c) => c.id === customerId);
                                                                    return customer ? `${customer.firstName} ${customer.lastName}` : "";
                                                                },
                                                            }, {
                                                                field: "groupRoleId",
                                                                headerName: "Rol",
                                                                flex: 1,
                                                                width: 200,
                                                                valueGetter: (params) => {
                                                                    const roleId = params.value;
                                                                    const role = roleOptions.find((role) => role.id === roleId);
                                                                    return role ? role.groupRoleName : "";
                                                                },
                                                            },

                                                            {
                                                                field: 'state', headerName: 'Estado', width: 120,

                                                                renderCell: (params) => {
                                                                    const stateOption = stateOptions.find((option) => option.value === params.value);
                                                                    const chipColor = getStateChipColor(params.value);
                                                                    const stateIcon = getStateIcon(params.value);

                                                                    return stateOption ? (
                                                                        <Chip label={stateOption.label} size="small"
                                                                              color={chipColor}
                                                                              icon={stateIcon}/>) : null;
                                                                },
                                                            }, // Use Spanish name for State
                                                            {
                                                                field: "actions",
                                                                headerName: "Acciones",
                                                                flex: 1,
                                                                renderCell: (params) => (<ButtonGroup variant="outlined"
                                                                                                      aria-label="outlined button group">
                                                                    <IconButton aria-label="edit">
                                                                        <EditIcon fontSize="small"/>
                                                                    </IconButton>
                                                                </ButtonGroup>),
                                                            },

                                                        ]}
                                                        getRowId={(row: any) => row.customerId + row.groupRoleId}
                                                        pageSize={5} // Set the maximum records per page to 5
                                                        rowsPerPageOptions={[5]} // Optional: Restrict the rows per page dropdown to only 5
                                                    />
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Stack>
                            </Stack>
                        </Grid>
                    </SoftBox>


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
                </Grid>
            </Grid>
        </DashboardLayout>
    );
};

