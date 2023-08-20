import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as yup from 'yup';
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import {yupResolver} from "@hookform/resolvers/yup";
import SoftBox from "../../../components/SoftBox";
import SoftTypography from "../../../components/SoftTypography";
import Grid from "@mui/material/Grid";
import {AccountBalanceWallet, AccountCircle} from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import {InputAdornment, Snackbar} from "@mui/material";
import {createAPIEndpoint, createAPIEndpointProducts, ENDPOINTS} from "../../../api";
import Divider from "@mui/material/Divider";
import MuiAlert from "@mui/material/Alert";

const schema = yup.object().shape({
    documentId: yup.string().required('Campo requerido'),
    accountAlias: yup.string(),
    productAccountId: yup.string().required('Seleccione un tipo de cuenta'),
});

const CustomerAccountForm = () => {

    const {control, handleSubmit, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            documentId: '',
            accountAlias: '',
            productAccountId: 'Seleccione un tipo de cuenta'
        },
    });
    // code for Loader
    const [options, setOptions] = useState([]);
    const [openProducts, setOpenProducts] = useState(false);
    const loading = openProducts && options.length === 0;

    // error codes
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // or "error"

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
                createAPIEndpointProducts(ENDPOINTS.productAccount).fetchAll(
                    {}
                ).then(
                    res => {
                        console.log(res.data);
                        setOptions(res.data);
                    }).then(
                    err => console.log(err)
                )
            }
        })()
    });

    useEffect(() => {
        if (!openProducts) {
            setOptions([]);
        }
    }, [openProducts]);


    const onSubmit = (data) => {

        console.log(data);
        createAPIEndpoint(ENDPOINTS.clients,
        ).postAccountCustomer(data, {})
            .then((response) => {
                setOpenSnackbar(true);
                setSnackbarMessage("Cuenta creada correctamente");
                setSnackbarSeverity("success");
            })
            .catch((error) => {
                console.log(error.response.data);
                if(error.response.data === "El usuario no existe"){
                    setOpenSnackbar(true);
                    setSnackbarMessage("El usuario con el documento de identidad ingresado no existe.");
                    setSnackbarSeverity("error");
                }
                else if (error.response.data === "400 : \"El usuario/compania ya tiene una cuenta de este tipo\"") {
                    setOpenSnackbar(true);
                    setSnackbarMessage("El usuario ya tiene una cuenta de este tipo");
                    setSnackbarSeverity("error");
                }

            });
    };

    return (
        <>

            <Grid
                container
                justifyContent="center"
                alignItems="center"
            >
                <Grid item xs={12} sm={8} md={6} lg={4}>
                    <SoftBox
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                            flexDirection: "column",
                            p: "1rem",
                        }}
                        shadow="lg"
                        borderRadius="lg"
                        width="fit-content"
                        variant="gradient"
                    >

                        <Grid container spacing={5}>
                            <Grid item xs={12}>
                                <SoftTypography
                                    variant="button"
                                    color="text"
                                    fontWeight="medium"
                                    sx={{
                                        mt: "auto",
                                        cursor: "pointer",
                                    }}
                                >
                                    Ingrese los datos de la Cuenta del Cliente
                                </SoftTypography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="documentId"
                                        control={control}
                                        render={({field}) => (
                                            <TextField
                                                required
                                                fullWidth
                                                type="text"
                                                id="documentId"
                                                label="Documento de Identidad"
                                                {...field}
                                                error={Boolean(errors.documentId)}
                                                helperText={errors.documentId?.message}
                                                InputProps={{
                                                    startAdornment: (
                                                        <AccountCircle/>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Controller
                                        name="accountAlias"
                                        control={control}
                                        render={({field}) => (
                                            <TextField
                                                fullWidth
                                                type="text"
                                                id="accountAlias"
                                                label="Alias de la cuenta"
                                                {...field}
                                                error={Boolean(errors.accountAlias)}
                                                helperText={errors.accountAlias?.message}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    {/* Branch */}
                                    <Controller
                                        name="productAccountId"
                                        control={control}
                                        render={({field}) => (
                                            <Autocomplete
                                                id="productAccountId"
                                                open={openProducts}
                                                onOpen={() => {
                                                    setOpenProducts(true);
                                                }}
                                                onClose={() => {
                                                    setOpenProducts(false);
                                                }}

                                                isOptionEqualToValue={(option, value) => option.uniqueKey === value?.uniqueKey}
                                                getOptionLabel={(option) => option.name || ''}
                                                fullWidth
                                                options={options}
                                                loading={loading}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Selecciona el tipo de cuenta"
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
                                                                    <AccountBalanceWallet/>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        error={Boolean(errors.uniqueKey)}
                                                        helperText={errors.uniqueKey?.message}
                                                    />
                                                )}
                                                onChange={(_event, data) => field.onChange(data?.uniqueKey ?? '')}
                                            />
                                        )}
                                    />
                                </Grid>


                                <Grid item xs={12}>
                                    <Button type="submit" variant="contained" color="primary">
                                        Crear cuenta
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </SoftBox>
                </Grid>
            </Grid>

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
        </>
    );
};

export default CustomerAccountForm;
