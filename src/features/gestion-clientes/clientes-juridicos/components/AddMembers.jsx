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
    clientList: yup.string().required('El cliente es necesario'),
    roleType: yup.string().required('El rol es necesario'),
});

const AddMemberForm = ({ setIsActive }) => {
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
    const { context, setContext } = useStateContext();
    const [openRoles, setOpenRoles] = useState(false);
    const [options, setOptions] = useState([]);
    const loading = openRoles && options.length === 0;

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
                createAPIEndpoint(ENDPOINTS.groupRole).fetchAll()
                    .then(
                        (res) => {

                            console.log("---> ",res.data)
                            console.log("EndPoint> ",ENDPOINTS.groupRole)
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
        if (!openRoles) {
            setOptions([]);

        }
    }, [openRoles]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            roleType: '',
            clientList: '',
        },
    });

    const clientsList = [
        { label: 'Cliente 1', value: 'CID1' },
        { label: 'Cliente 2', value: 'CID2' },
        { label: 'Cliente 3', value: 'CID3' },
    ];

    const rolesType = [
        { label: 'Representante legal', value: 'RL' },
        { label: 'Accionista', value: 'ACC' },
        { label: 'Apoderado', value: 'APO' },
    ];

    const onSubmit = (data, event) => {
        if (context.members && Array.isArray(context.members)) {
            const membersExists = context.members.some(
                (member) => member.roleType && member.roleType === data.roleType
            );
            if (membersExists) {
                setShowErrorSnackbar(true);
                return; // Exit the function if the phone number already exists
            } else {
                const updatedMembers = Array.isArray(context.members)
                    ? [...context.members, data]
                    : [data];
                setContext({
                    ...context.members,
                    members: updatedMembers,
                });
            }
        } else {
            setContext({
                ...context.members,
                members: [data],
            });
        }
    };

    const handleOpen = () => {
        setIsActive(false);
    }

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
                        <Controller
                            name="clientList"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    select // tell TextField to render select
                                    label="Clientes"
                                    error={Boolean(errors.clientList)}
                                    helperText={errors.clientList?.message}
                                >
                                    {clientsList.map((type) => (
                                        <MenuItem key={type.value} value={type.label}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Grid item xs={12}>
                            {/* Branch */}
                            <Controller
                                name="roleType"
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
                                                error={Boolean(errors.roleType)}
                                                helperText={errors.roleType?.message}
                                            />
                                        )}
                                        onChange={(_event, data) => field.onChange(data?.id ?? '')}
                                    />
                                )}
                            />
                        </Grid>
                    </Box>

                    <Box gridColumn="span 12">
                        <Button color="primary" variant="contained" fullWidth type="submit"
                            onClick={handleOpen}>
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
