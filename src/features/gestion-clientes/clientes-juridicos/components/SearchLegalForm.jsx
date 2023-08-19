
import { Box, Button, MenuItem, Select, TextField, Popover, IconButton, InputAdornment, FormControlLabel, Checkbox, Autocomplete } from "@mui/material";
import SoftTypography from "../../../../components/SoftTypography";
import React, { Fragment, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchIcon from "@mui/icons-material/Search";
import { createAPIEndpoint, ENDPOINTS } from "../../../../api";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { AddLocation, Business } from "@mui/icons-material";

const schema = yup.object().shape({
    // Define your validation rules for each field here
    stateType: yup.string().optional("State is required"),
    locationId: yup.string().optional("Location is required"),
    branchId: yup.string().optional("Branch is required"),
});

const stateOptions = [
    { value: "ACT", label: "Activo" },
    { value: "INA", label: "Inactivo" },
    { value: "SUS", label: "Suspendido" },
    { value: "BLO", label: "Bloqueado" },
];

export const SearchLegalForm = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            stateType: '',
            locationId: '',
            branchId: '',
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

    const onSubmit = (data) => {
        console.log("-->", data);
        createAPIEndpoint(ENDPOINTS.groupCompany)
            .fetchByBranchandLocationandState(data.branchId ,data.locationId, data.state)
            .then((res) => {
                navigate("/clientesjuridicos/results", { state: { data: res.data } });
            })
            .catch((error) => {
                console.error(error);
                return [];
            });

        // console.log(ClientResponse)
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Búsqueda de Empresas <SearchIcon />
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
                                    control={control}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            // label="Estado"
                                            select
                                            fullWidth
                                            error={Boolean(errors.stateType)}
                                            helperText={errors.stateType?.message}
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
                                    control={control}
                                    render={({ field }) => (
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
                                                                {loadingLocation ? <CircularProgress color="inherit" size={20} /> : null}
                                                                {params.InputProps.endAdornment}
                                                            </Fragment>
                                                        ),
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AddLocation />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    error={Boolean(errors.locationId)}
                                                    helperText={errors.locationId?.message}
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
                            </>
                        )}
                    </Box>


                    <Box gridColumn="span 12" sx={{ textAlign: 'center' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Enviar
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};
