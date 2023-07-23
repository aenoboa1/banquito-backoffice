import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from '@mui/material/Divider';
import {AccountTree, AddLocationSharp, TravelExplore} from "@mui/icons-material";
import Button from "@mui/material/Button";
import {Formik, ErrorMessage, Form} from 'formik';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {InputLabel} from "@mui/material";
import ViewCountry from "./ViewCountry";


export default function Country() {
    const [showCountryForm, setShowCountryForm] = useState(false);
    const [showCountrySearch, setShowCountrySearch] = useState(false);
    const toggleCountryFormVisibility = () => {
        setShowCountryForm(true);
    }
    const toggleCountrySearchVisibility = () => {
        setShowCountrySearch(!showCountrySearch);
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
                    else if (values.phoneCode.length !== 4) {
                        errors.phoneCode = 'El código debe tener 4 caracteres!';
                    }
                    return errors;
                }}
                onSubmit={(values, {resetForm}) => {
                    resetForm();
                    console.log(values);
                    setShowCountryForm(false)
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

