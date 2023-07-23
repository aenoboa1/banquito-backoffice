import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from '@mui/material/Divider';
import {AccountTree, AddLocationSharp, Delete, Edit, LocationSearching, TravelExplore} from "@mui/icons-material";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import {Formik, ErrorMessage, Form} from 'formik';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {InputAdornment, InputLabel} from "@mui/material";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import {createAPIEndpoint, ENDPOINTS} from "../../../api";
import CardActions from "@mui/material/CardActions";


export default function Country() {
    const [searchedCountry, setSearchedCountry] = useState('');
    const [countryInfo, setCountryInfo] = useState(null);
    const [showCountryForm, setShowCountryForm] = useState(false);
    const [showCountrySearch, setShowCountrySearch] = useState(false);
    const [isCreated, setIsCreated] = useState(false);



    const toggleCountryFormVisibility = () => {
        setShowCountryForm(!showCountryForm);
    }
    const toggleCountrySearchVisibility = () => {
        setShowCountrySearch(!showCountrySearch);
    }

    const handleClickSearchCountry = () => {
        console.log('searchedCountry: ', searchedCountry);
        getCountry(searchedCountry);

    }

    const handlerChangeCountry = (event) => {
        setSearchedCountry(event.target.value);
    }

    const getCountry = (searchedCountry) => {
        createAPIEndpoint(ENDPOINTS.country,
        ).fetchByName(searchedCountry,{

        }).then( response =>
            response.status.valueOf() === 200 ? setCountryInfo(response.data) : setCountryInfo(null)
        ).catch(
            err => console.log(err)
        )
    };

    const deleteCountry = (id) => {
        createAPIEndpoint(ENDPOINTS.country,
        ).delete(id,{

        }).then( response =>
            console.log(response)
        ).catch(
            err => console.log(err)
        )

    }

    const submit = (data) => {
        createAPIEndpoint(ENDPOINTS.country,
        ).post(data,{

        }).then( response =>
            response.status.valueOf() === 200 ? setIsCreated(true) : setIsCreated(false)

        ).catch(
            err => console.log(err)
        )
    };

    const CountryCard = () => {
        return (
            <Box >
                <Grid container  sx={{justifyContent: 'center'}}>
                    <Card sx={{width: '50%'}}>
                        <CardContent sx={{p:1,m:1}}>
                            <Typography variant="h5" component="div">
                                País: {countryInfo.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Código de pías: {countryInfo.code}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Código de teléfono: {countryInfo.phoneCode}
                            </Typography>
                        </CardContent>
                        <CardActions sx={{p:1,m:1}}>
                            <IconButton size="Normal">
                                <Edit/>
                            </IconButton>
                            <IconButton onClick={deleteCountry(countryInfo.code)} size="Normal">
                                <Delete/>
                            </IconButton>
                        </CardActions>
                    </Card>
                </Grid>

            </Box>
        )
    }

    const ViewCountry = () => {
        return (
            <Box>
                <Grid container spacing={2} sx={{justifyContent:'center'}}>
                    <FormControl sx={{ m: 1, p:1, width:'50%' }} variant="outlined">
                        <InputLabel htmlFor="name">País</InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="name"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton variant="contained"
                                        onClick={handleClickSearchCountry}
                                        edge="end"
                                    >
                                        <LocationSearching/>
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Buscar País"
                            value={searchedCountry}
                            onChange={handlerChangeCountry}
                        />
                    </FormControl>
                </Grid>
                <Divider></Divider>
                {countryInfo && <CountryCard/>}
            </Box>
        )
    }

    const AlertCountryCreated = () => {
        return (
            <Collapse in={isCreated}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setIsCreated(false);
                                setShowCountryForm(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    País creado con éxito!
                </Alert>
            </Collapse>

        )
    }


    const CreateCountryForm = () => {
        return (
            <Formik
                initialValues={{
                    code: '',
                    name: '',
                    phoneCode: ''
                }}
                validate={(values) => {
                    let errors = {};
                    if (!values.code) {
                        errors.code = 'Código de país requerido!';
                    }
                    else if (values.code.length !== 3) {
                        errors.code = 'El código debe tener 3 caracteres!';
                    }
                    else if (!/^[A-Za-z]+$/.test(values.code)) {
                        errors.code = 'El código debe contener solo letras!';
                    }
                    if (!values.name) {
                        errors.name = 'Nombre de país requerido!';
                    }
                    else if (!/^[A-Za-z]+$/.test(values.name)) {
                        errors.name = 'El nombre debe contener solo letras!';
                    }
                    if (!values.phoneCode) {
                        errors.phoneCode = 'Código de teléfono requerido!';
                    }
                    else if (values.phoneCode.length > 4) {
                        errors.phoneCode = 'El código debe tener hasta 4 caracteres!';
                    }
                    return errors;
                }}
                onSubmit={(values, {resetForm}) => {
                    resetForm();
                    submit(values)
                }}
            >
                {({ errors,values,handleChange   }) => (
                    <Box >
                        <Grid container  sx={{justifyContent: 'center'}}>
                            <Card sx={{width: '50%'}}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Nuevo País
                                    </Typography>
                                    <Box >
                                        <Form sx={{width: '50%'}}>
                                            <FormControl sx={{ p: 1, m: 1, display:'block'}}>
                                                <InputLabel htmlFor="code" size="small">Código</InputLabel>
                                                <OutlinedInput fullWidth id="code" name="code" onChange={handleChange} value={values.code} inputLabelProps={{shrink:true}} />
                                                <ErrorMessage name="code" component={() => (<FormHelperText id="component-error-text">{errors.code}</FormHelperText>)}/>
                                            </FormControl>
                                            <FormControl sx={{ p: 1, m: 1, display:'block' }}>
                                                <InputLabel htmlFor="name" size="small">Nombre</InputLabel>
                                                <OutlinedInput fullWidth id="name" name="name" onChange={handleChange} value={values.name} inputLabelProps={{shrink:true}} />
                                                <ErrorMessage name="name" component={() => (<FormHelperText id="component-error-text">{errors.name}</FormHelperText>)}/>
                                            </FormControl>
                                            <FormControl sx={{ p: 1, m: 1, display:'block' }}>
                                                <InputLabel htmlFor="phoneCode" size="small">Código de teléfono</InputLabel>
                                                <OutlinedInput fullWidth id="phoneCode" name="phoneCode" onChange={handleChange} value={values.phoneCode} inputLabelProps={{shrink:true}}/>
                                                <ErrorMessage name="phoneCode" component={() => (<FormHelperText id="component-error-text">{errors.phoneCode}</FormHelperText>)}/>
                                            </FormControl>
                                            <Button type="submit" variant="filled">Crear</Button>
                                        </Form>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                    </Box>
                )}
            </Formik>
        )
    }

    return (
        <Box>
            {isCreated && <AlertCountryCreated/>}
            <Grid container spacing={6} sx={{justifyContent: 'center'}}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center'}}>
                        <Button aria-label="add" size="large" onClick={toggleCountryFormVisibility}  startIcon={<AddLocationSharp/>}>
                            Crear
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center'}}>
                        <Button aria-label="view" size="large" onClick={toggleCountrySearchVisibility} startIcon={<TravelExplore/>}>
                            Buscar
                        </Button>

                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center'}}>
                        <Button aria-label="edit" size="large" startIcon={<AccountTree/>}>
                            Estructura Geográfica
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Divider/>
            {showCountryForm && <CreateCountryForm/>}
            {showCountrySearch && <ViewCountry/>}
        </Box>
    );
}

