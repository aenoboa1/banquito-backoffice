import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from '@mui/material/Divider';
import { AccountTree, AddLocationSharp, Delete, Edit, LocationSearching, TravelExplore } from "@mui/icons-material";
import Button from "@mui/material/Button";
import IconButton from '@mui/material/IconButton';
import { Formik, ErrorMessage, Form } from 'formik';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { InputAdornment, InputLabel } from "@mui/material";
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { createAPIEndpoint, ENDPOINTS } from "../../../api";
import { useNavigate } from 'react-router-dom';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import axios from 'axios';

export default function GeoStructure() {
    const [searchedGeostructure, setSearchedGeoStructure] = useState('');
    const [geoStructureInfo, setGeoStructureInfo] = useState(null);
    const [showGeoStructureForm, setShowGeoStructureForm] = useState(false);
    const [showGeoStructureSearch, setShowGeoStructureSearch] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [country, setCountry] = useState('');
    const [countries, setCountries] = useState([]);

    const [isResponse, setIsResponse] = useState(false);

    useEffect(() => {
        getAllCountries();
    }, []);

    const navigate = useNavigate();

    const handleCountryChange = (event) => {
        setCountry(event.target.value);
    };

    const toggleGeoStructureFormVisibility = () => {
        setShowGeoStructureForm(!showGeoStructureForm);
    }

    const toggleGeoStructureSearchVisibility = () => {
        setShowGeoStructureSearch(!showGeoStructureSearch);
    }

    const getAllCountries = () => {
        createAPIEndpoint(ENDPOINTS.country,
        ).fetchAll({

        }).then(response =>
            response.status.valueOf() === 200 ? setCountries(response.data) : setCountries(null),
        ).catch(
            err => console.log(err)
        )
    }

    const getGeoStructure = (searchedGeostructure) => {
        createAPIEndpoint(ENDPOINTS.geoStructure,
        ).fetchBy(searchedGeostructure, {

        }).then(response =>
            response.status.valueOf() === 200 ? setGeoStructureInfo(response.data) : setGeoStructureInfo(null)
        ).catch(
            err => console.log(err)
        )
    };

    const deleteGeostructure = (id) => {
        createAPIEndpoint(ENDPOINTS.geoStructure,
        ).delete(id, {

        }).then(response =>
            response.status.valueOf() === 200 ? setConfirmDelete(true) : setConfirmDelete(false)
        ).catch(
            err => console.log(err)
        )

    }

    const submitGeo = (data, code) => {
        const { levelCode, name } = data;
        const countryCode = code
        const geoStructure = {
            levelCode: levelCode,
            name: name,
        };
        axios.post('http://localhost:8080/api/v1/geo-structure', geoStructure, { params: { countryCode: countryCode } })
            .then(response => {
                if (response.status.valueOf() === 200) {
                    setIsResponse(true);
                }

            }).catch((error) => {
                console.log(error);

            });
    };

    const AlertCreated = () => {
        return (
            <Collapse in={isResponse}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setIsResponse(false);
                                setShowGeoStructureForm(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    Estructura geográfica creada con éxito!
                </Alert>
            </Collapse>

        )
    }

    const AlerDeletedItem = () => {
        return (
            <Collapse in={confirmDelete}>
                <Alert
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setConfirmDelete(false);
                                toggleGeoStructureSearchVisibility();
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    Estrucutra geográfica Eliminada!
                </Alert>
            </Collapse>
        )
    }

    const CreateGeoStructureForm = () => {
        return (
            <Formik
                initialValues={{
                    levelCode: '',
                    name: '',
                }}
                validate={(values) => {
                    let errors = {};
                    if (!values.levelCode) {
                        errors.code = 'nivel geográfico requerido!';
                    }
                    else if (values.levelCode > 4) {
                        errors.code = 'El código debe tener un dígito entre 1 y 3!';
                    }
                    if (!values.name) {
                        errors.name = 'Nombre de estructura geográfica requerido!';
                    }
                    else if (!/^[A-Za-z]+$/.test(values.name)) {
                        errors.name = 'El nombre debe contener solo letras!';
                    }

                    return errors;
                }}
                onSubmit={(values, { resetForm }) => {
                    resetForm();
                    console.log(values, country);
                    submitGeo(values, country);
                }}
            >
                {({ errors, values, handleChange }) => (
                    <Box >
                        <Grid container sx={{ justifyContent: 'center' }}>
                            <Card sx={{ width: '50%' }}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Crear Estructura Geográfica
                                    </Typography>
                                    <Box >
                                        <Form sx={{ width: '50%' }}>
                                            <FormControl sx={{ p: 1, m: 1, display: 'block' }} >
                                                <InputLabel id="countryLbl">País</InputLabel>
                                                <Select fullWidth
                                                    labelId="countryLbl"
                                                    id='country'
                                                    name="country"
                                                    value={country}
                                                    label="País"
                                                    onChange={handleCountryChange}
                                                >
                                                    {countries.map((country) => (
                                                        <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
                                                    ))}

                                                </Select>
                                            </FormControl>
                                            <FormControl sx={{ p: 1, m: 1, display: 'block' }}>
                                                <InputLabel htmlFor="levelCode" size="small">Código</InputLabel>
                                                <OutlinedInput fullWidth id="levelCode" name="levelCode" onChange={handleChange} value={values.levelCode} />
                                                <ErrorMessage name="levelCode" component={() => (<FormHelperText id="component-error-text">{errors.levelCode}</FormHelperText>)} />
                                            </FormControl>
                                            <FormControl sx={{ p: 1, m: 1, display: 'block' }}>
                                                <InputLabel htmlFor="name" size="small">Nombre</InputLabel>
                                                <OutlinedInput fullWidth id="name" name="name" onChange={handleChange} value={values.name} />
                                                <ErrorMessage name="name" component={() => (<FormHelperText id="component-error-text">{errors.name}</FormHelperText>)} />
                                            </FormControl>

                                            <Button type="submit" variant="filled" color="primary">Crear</Button>
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
            {isResponse && <AlertCreated />}
            {confirmDelete && <AlerDeletedItem />}
            <Grid container spacing={6} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center' }}>
                        <Button aria-label="add" size="large" onClick={toggleGeoStructureFormVisibility} startIcon={<AddLocationSharp />}>
                            Crear
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center' }}>
                        <Button aria-label="view" size="large" startIcon={<AddLocationAltIcon />}>
                            Crear localidad
                        </Button>

                    </Paper>
                </Grid>
            </Grid>
            <Divider />
            {showGeoStructureForm && <CreateGeoStructureForm />}
        </Box>
    );
}