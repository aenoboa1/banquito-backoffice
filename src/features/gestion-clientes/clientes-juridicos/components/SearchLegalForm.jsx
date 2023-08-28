import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    InputAdornment,
    MenuItem,
    Tab,
    Tabs,
    TextField
} from "@mui/material";
import SoftTypography from "../../../../components/SoftTypography";
import React, {Fragment, useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import SearchIcon from "@mui/icons-material/Search";
import {createAPIEndpoint, ENDPOINTS} from "../../../../api";
import {useNavigate} from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import {AddLocation, Business} from "@mui/icons-material";


// Schema for the state search form
const stateSchema = yup.object().shape({
    stateType: yup.string().optional("Estado es requerido"),
    locationId: yup.string().optional("Ubicación es requerida"),
    branchId: yup.string().optional("Sucursal es requerida"),
});

// Schema for the document search form
const documentSchema = yup.object().shape({
    typeDocumentId: yup.string().required("Tipo de Documento es requerido"),
    documentId: yup.string().required("Documento es requerido"),
});
const stateOptions = [
    {value: "ACT", label: "Activo"},
    {value: "INA", label: "Inactivo"},
    {value: "SUS", label: "Suspendido"},
    {value: "BLO", label: "Bloqueado"},
];

export const SearchLegalForm = () => {


    const {
        handleSubmit: handleSubmitComplete,
        control: controlComplete,
        formState: {errors: errorsComplete},
    } = useForm({
        resolver: yupResolver(stateSchema),
        defaultValues: {
            stateType: '',
            locationId: '',
            branchId: '',
        },
    });

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

    const navigate = useNavigate();
    const [ClientResponse, setClientResponse] = useState([]);
    const [isStateFieldEnabled, setStateFieldEnabled] = useState(true);
    const [isDocumentIdFieldEnabled, setDocumentIdFieldEnabled] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const [searchByState, setSearchByState] = useState(false);
    const [searchByLocation, setSearchByLocation] = useState(false);
    const [searchByBranch, setSearchByBranch] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStateFieldToggle = () => {
        setStateFieldEnabled(!isStateFieldEnabled);
        handleClose();
    };

    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    const [openBranches, setOpenBranches] = useState(false);
    const [optionsBranches, setOptionsBranches] = useState([]);
    const loadingBranches = openBranches && optionsBranches.length === 0;

    const [openLocations, setOpenLocations] = useState(false);
    const [optionsLocations, setOptionsLocations] = useState([]);
    const loadingLocation = openLocations && optionsLocations.length === 0;


    useEffect(() => {
        let active = true;
        if (!loadingBranches) {
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
                        setOptionsBranches(res.data);
                    }).then(
                    err => console.log(err)
                )
            }
        })();

        return () => {
            active = false;
        };
    }, [loadingBranches]);

    useEffect(() => {
        let active = true;
        if (!loadingLocation) {
            return undefined;
        }

        (async () => {
            await sleep(1e3);
            if (active) {
                createAPIEndpoint(ENDPOINTS.geoStructure).fetchProvinceByCountry(
                    'ECU',
                    '2'
                ).then(
                    (res) => {
                        setOptionsLocations(res.data.locations)
                    }).then(
                    err => console.log(err)
                )
            }
        })();
        return () => {
            active = false;
        };
    }, [loadingLocation]);

    useEffect(() => {
        if (!openBranches) {
            setOptionsBranches([]);
        }
    }, [openBranches]);

    useEffect(() => {
        if (!openLocations) {
            setOptionsLocations([]);
        }
    }, [openLocations]);

    const handleDocumentIdFieldToggle = () => {
        setDocumentIdFieldEnabled(!isDocumentIdFieldEnabled);
        handleClose();
    };

    const onSubmitState = (data) => {

        console.log("-->", data);

        createAPIEndpoint(ENDPOINTS.groupCompany)
            .fetchByBranchAndLocationAndState(data.branchId, data.locationId, data.stateType)
            .then((res) => {
                navigate("/clientesjuridicos/results", {state: {data: res.data}});
            })
            .catch((error) => {
                console.error(error);
                return [];
            });

        // console.log(ClientResponse)
    };

    const onSubmitDocument = (data) => {
        console.log("-->", data);
        createAPIEndpoint(ENDPOINTS.groupCompany)
            .fetchCompanyByTypeDocumentAndDocumentId(data.typeDocumentId, data.documentId)
            .then((res) => {
                navigate("/clientesjuridicos/results", {state: {data: res.data}});
            })
            .catch((error) => {
                console.error(error);
                return [];
            });

        // console.log(ClientResponse)
    };
    const documentTypes = [
        {label: 'RUC', value: 'RUC'},
    ];

    return (
        <div>

            <Tabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                <Tab label="Busqueda por Sucursales"/>
                <Tab label="Busqueda por Documento"/>
            </Tabs>

            {/* Content of the first tab */}
            {activeTab === 0 && (
                <form onSubmit={handleSubmitComplete(onSubmitState)}>
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                        <Box gridColumn="span 12">
                            <SoftTypography align="center" sx={{fontWeight: 'bold'}}>
                                Búsqueda de Empresas <SearchIcon/>
                            </SoftTypography>
                        </Box>

                        <Box gridColumn="span 11">
                            {/* Type of Document */}
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={searchByState}
                                        onChange={(e) => setSearchByState(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Estado"
                            />
                            {searchByState && (
                                <>
                                    <Controller
                                        name="stateType"
                                        control={controlComplete}
                                        render={({field}) => (
                                            <TextField
                                                {...field}
                                                // label="Estado"
                                                select
                                                fullWidth
                                                error={Boolean(errorsComplete.stateType)}
                                                helperText={errorsComplete.stateType?.message}
                                            >
                                                {stateOptions.map((type) => (
                                                    <MenuItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </>
                            )}
                        </Box>
                        <Box gridColumn="span 12">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={searchByLocation}
                                        onChange={(e) => setSearchByLocation(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Localizacion"
                            />
                            {searchByLocation && (
                                <>
                                    <Controller
                                        name="locationId"
                                        control={controlComplete}
                                        render={({field}) => (
                                            <Autocomplete
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
                                                options={optionsLocations}
                                                loading={loadingLocation}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Selecciona un cantón"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <Fragment>
                                                                    {loadingLocation ? <CircularProgress color="inherit"
                                                                                                         size={20}/> : null}
                                                                    {params.InputProps.endAdornment}
                                                                </Fragment>
                                                            ),
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <AddLocation/>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        error={Boolean(errorsComplete.locationId)}
                                                        helperText={errorsComplete.locationId?.message}
                                                    />
                                                )}
                                                onChange={(_event, data) => field.onChange(data?.id ?? '')}
                                            />
                                        )}
                                    />
                                </>
                            )}
                        </Box>
                        <Box gridColumn="span 12">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={searchByBranch}
                                        onChange={(e) => setSearchByBranch(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Sucursal"
                            />
                            {searchByBranch && (
                                <>
                                    <Controller
                                        name="branchId"
                                        control={controlComplete}
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
                                                // getOptionSelected={(option, value) =>
                                                //     value === undefined || value === "" || option.uniqueKey === value.uniqueKey
                                                // }
                                                isOptionEqualToValue={(option, value) => option.uniqueKey === value?.uniqueKey}
                                                getOptionLabel={(option) => option.name || ''}
                                                fullWidth
                                                options={optionsBranches}
                                                loading={loadingBranches}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Seleccione una sucursal"
                                                        InputProps={{
                                                            ...params.InputProps,
                                                            endAdornment: (
                                                                <Fragment>
                                                                    {loadingBranches ?
                                                                        <CircularProgress color="inherit"
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
                                                        error={Boolean(errorsComplete.branchId)}
                                                        helperText={errorsComplete.branchId?.message}
                                                    />
                                                )}
                                                onChange={(_event, data) => field.onChange(data?.uniqueKey ?? '')}
                                            />
                                        )}
                                    />
                                </>
                            )}
                        </Box>


                        <Box gridColumn="span 12" sx={{textAlign: 'center'}}>
                            <Button type="submit" variant="contained" color="primary">
                                Enviar
                            </Button>
                        </Box>
                    </Box>
                </form>
            )}
            {/* Content of the second tab */}
            {activeTab === 1 && (
                <form onSubmit={handleSubmitDocument(onSubmitDocument)}>
                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                        <Box gridColumn="span 12">
                            <SoftTypography align="center" sx={{fontWeight: 'bold'}}>
                                Busqueda de Empresas <SearchIcon/>
                            </SoftTypography>
                        </Box>

                        <Box gridColumn="span 12">
                            {/* Type of Document */}
                            <Controller
                                name="typeDocumentId"
                                control={controlDocument}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        select
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
                                        disabled={!isDocumentIdFieldEnabled}
                                        {...field}
                                        error={!!errorsDocument.documentId}
                                        helperText={errorsDocument.documentId?.message}
                                    />
                                )}
                            />
                        </Box>

                        <Box gridColumn="span 12" sx={{textAlign: 'center'}}>
                            <Button type="submit" variant="contained" color="primary">
                                Enviar
                            </Button>
                        </Box>
                    </Box>
                </form>
            )}
        </div>
    );
};
