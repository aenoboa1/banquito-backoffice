import React, { Fragment, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Alert, Autocomplete, Grid, InputAdornment, Portal, Snackbar, TextField, } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import useStateContext from "../../../../context/custom/useStateContext";
import { createAPIEndpoint, ENDPOINTS } from "../../../../api";
import CircularProgress from "@mui/material/CircularProgress";
import { Business } from "@mui/icons-material";

const validationSchema = yup.object({
    customerId: yup.string(),
    groupRoleId: yup.string(),
});

const AddMemberForm = ({ setIsActive }) => {
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
    const { context, setContext } = useStateContext();

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

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            groupRoleId: '',
            customerId: '',
        },
    });

    const onSubmit = (data) => {
        console.log(data);

        const updatedMembers = Array.isArray(context.groupMembers)
            ? [...context.groupMembers, data]
            : [data];

        setContext({
            ...context.groupMembers,
            groupMembers: updatedMembers,

        });
    };


    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 2fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Agregar
                        </SoftTypography>
                    </Box>

                    <Box gridColumn="span 12">
                        <Grid item xs={12}>
                            <Controller
                                name="customerId"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        id="clientList"
                                        open={openListClient}
                                        onOpen={() => {
                                            setOpenListClient(true);
                                        }}
                                        onClose={() => {
                                            setOpenListClient(false);
                                        }}

                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                        getOptionLabel={(option) => {
                                            return option.firstName + ' ' + option.lastName || '';
                                        }}
                                        groupBy={(option) => option.firstLetter}
                                        fullWidth
                                        options={optionsClient}
                                        loading={loadingClient}
                                        loadingText={"Cargando Clientes..."}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Selecciona un cliente"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <Fragment>
                                                            {loadingClient ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </Fragment>
                                                    ),
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={Boolean(errors.clientList)}
                                                helperText={errors.clientList?.message}
                                            />
                                        )}
                                        onChange={(_event, data) => field.onChange(data?.id ?? '')}
                                    />
                                )}
                            />
                        </Grid>
                    </Box>

                    <Box gridColumn="span 12">
                        <Grid item xs={12}>
                            <Controller
                                name="groupRoleId"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        id="roleType"
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
                                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </Fragment>
                                                    ),
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={Boolean(errors.groupRoleId)}
                                                helperText={errors.groupRoleId?.message}
                                            />
                                        )}
                                        onChange={(_event, data) => field.onChange(data?.id ?? '')}
                                    />
                                )}
                            />
                        </Grid>
                    </Box>

                    <Box gridColumn="span 12">
                        <Button color="primary" variant="contained" fullWidth type="button"
                            onClick={handleSubmit(onSubmit)}>
                            Agregar Miembro
                        </Button>
                    </Box>
                </Box>
            </form>
            {showErrorSnackbar && (
                <Portal>
                    <Snackbar
                        open={showErrorSnackbar}
                        autoHideDuration={6000}
                        onClose={() => setShowErrorSnackbar(false)}
                    >
                        <Alert onClose={() => setShowErrorSnackbar(false)} severity="error">
                            El rol ya fue asignado.
                        </Alert>
                    </Snackbar>
                </Portal>
            )}
        </div>
    );
};

export default AddMemberForm;
