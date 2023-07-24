
import {Box, Button, MenuItem, Select, TextField, Popover, IconButton, InputAdornment} from "@mui/material";
import SoftTypography from "../../../../components/SoftTypography";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {createAPIEndpoint, ENDPOINTS} from "../../../../api";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import {Business} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

const schema = yup.object().shape({
    // Define your validation rules for each field here
    state: yup.string().optional("State is required"),
    documentId: yup.string().optional("DocumentId is required"),
});

const stateOptions = [
    { value: "ACT", label: "Activo" },
    { value: "INA", label: "Inactivo" },
    { value: "SUS", label: "Suspendido" },
    { value: "BLO", label: "Bloqueado" },
];

export const SearchClientForm = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });


    const navigate = useNavigate();
    const [ClientResponse, setClientResponse] = useState([]);

    const [isStateFieldEnabled, setStateFieldEnabled] = useState(true);
    const [isDocumentIdFieldEnabled, setDocumentIdFieldEnabled] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

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


    const handleDocumentIdFieldToggle = () => {
        setDocumentIdFieldEnabled(!isDocumentIdFieldEnabled);
        handleClose();
    };

    const onSubmit = (data) => {
        createAPIEndpoint(ENDPOINTS.accounts)
            .fetchByStatusOrDocumentOrBranch(data.state, data.documentId,'6')
            .then((res) => {
                navigate("/clientesnaturales/results", { state: { data: res.data } });
            })
            .catch((error) => {
                console.error(error);
                return [];
            });

        console.log(ClientResponse)


    };


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Busqueda de Clientes <SearchIcon />
                        </SoftTypography>
                    </Box>
                    <Box gridColumn="span 12">
                        <Controller
                            name="state"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    select
                                    fullWidth
                                    label="Estado"
                                    variant="outlined"
                                    disabled={!isStateFieldEnabled}
                                    {...field}
                                    error={!!errors.state}
                                    helperText={errors.state?.message}
                                >
                                    {stateOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>
                    <Box gridColumn="span 12">
                        <Controller
                            name="documentId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Documento de Identidad"
                                    variant="outlined"
                                    disabled={!isDocumentIdFieldEnabled}
                                    {...field}
                                    error={!!errors.documentId}
                                    helperText={errors.documentId?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12" sx={{ textAlign: 'center' }}>
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
                    </Box>
                    <Box gridColumn="span 12" sx={{ textAlign: 'center' }}>
                        <IconButton onClick={handleClick}>
                            <SettingsIcon />
                        </IconButton>
                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <Box p={2}>
                                <IconButton onClick={handleStateFieldToggle}>
                                    <SettingsIcon /> Habilitar/Deshabilitar Estado
                                </IconButton>
                                <IconButton onClick={handleDocumentIdFieldToggle}>
                                    <SettingsIcon /> Habilitar/Deshabilitar Documento de Identidad
                                </IconButton>
                            </Box>
                        </Popover>
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
