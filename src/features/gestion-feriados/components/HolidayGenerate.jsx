import React,{useState, useEffect} from "react";
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import {ErrorMessage, Field, Form, Formik} from "formik";
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { createAPIEndpoint, ENDPOINTS } from "./../../../api/index";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: '#fff',
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
    padding: 20,
};

const selectStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
};

const ErrorText = ({ children }) => <div style={{ color: 'red', fontSize: '12px' }}>{children}</div>;

export default function HolidayGenerate({ isOpen, onClose }) {
    const [openLocations, setOpenLocations] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openCountries, setOpenCountries] = useState(false);
    const [countryOptions, setCountryOptions] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);

    useEffect(() => {
        if (openLocations && options.length === 0) {
            setLoading(true);

            fetchLocations()
                .then((res) => {
                    console.log(res.locations);
                    setOptions(res.locations);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [openLocations]);

    const fetchLocations = () => {
        return createAPIEndpoint(ENDPOINTS.geoStructure)
            .fetchProvinceByCountry("ECU", "1")
            .then((res) => res.data)
            .catch((error) => {
                console.error(error);
                return [];
            });
    };

    useEffect(() => {
        if (openCountries && countryOptions.length === 0) {
            setLoadingCountries(true);

            fetchCountries()
                .then((res) => {
                    console.log(res);
                    setCountryOptions(res);
                    setLoadingCountries(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoadingCountries(false);
                });
        }
    }, [openCountries]);

    const fetchCountries = () => {
        return createAPIEndpoint(ENDPOINTS.country)
            .fetchCountry()
            .then((res) => res.data)
            .catch((error) => {
                console.error(error);
                return [];
            });
    };

    const submit =(data) =>{
        let requestData = {
            year: data.year,
            month: data.month,
            codeCountry: data.codeCountry,
            idLocation: data.idLocation,
            saturday: false,
            sunday: false,
        };

        if (data.daysOfWeek === "1") {
            requestData.saturday = true;
        } else if (data.daysOfWeek === "2") {
            requestData.sunday = true;
        } else if (data.daysOfWeek === "3") {
            requestData.saturday = true;
            requestData.sunday = true;
        }

        console.log(requestData)
        createAPIEndpoint(ENDPOINTS.holiday,
        ).postHolidayGenerate(
            requestData.year,
            requestData.month,
            requestData.saturday,
            requestData.sunday,
            requestData.codeCountry,
            requestData.idLocation,
        ).then((response)=>{
            onClose();
        }).catch((error) => console.log(error));
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div style={modalStyle}>
                <Typography variant="h5" gutterBottom>
                    <Box sx={{ textAlign: 'center', m: 1 }}>Generar feriados de un mes</Box>
                </Typography>
                <Formik
                    initialValues={{
                        year:'',
                        month:'',
                        daysOfWeek:'',
                        codeCountry:'',
                        idLocation:''
                    }}
                    validate={(values) => {
                        const errors = {};
                        if (!values.year) {
                            errors.year = 'Debe seleccionar un año';
                        }
                        if (!values.month) {
                            errors.month = 'Debe seleccionar un mes';
                        }
                        if (!values.codeCountry) {
                            errors.codeCountry = 'Debe escribir un país';
                        }
                        if (!values.daysOfWeek) {
                            errors.daysOfWeek = 'Debe seleccionar al menos una opción';
                        }
                        return errors;
                    }}
                    onSubmit={(values, {resetForm}) =>{
                        submit(values);
                        resetForm();
                    }}
                >
                    {({ errors, values, handleChange }) => (
                        <Form>
                            <div className="form-group">
                                <label>Año:</label>
                                <Field
                                    type="text"
                                    name="year"
                                    placeholder="Ej: 1998"
                                    as={TextField}
                                    pattern="[0-9]"
                                    onChange={handleChange}
                                    value = {values.year}
                                    fullWidth
                                />
                                <ErrorMessage name="year" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Mes</label>
                                <Field
                                    type="text"
                                    name="month"
                                    as="select"
                                    onChange={handleChange}
                                    style={selectStyle}
                                >
                                    <option value="" >Seleccione un mes</option>
                                    <option value="1" >Enero</option>
                                    <option value="2" >Febrero</option>
                                    <option value="3" >Marzo</option>
                                    <option value="4" >Abril</option>
                                    <option value="5" >Mayo</option>
                                    <option value="6" >Junio</option>
                                    <option value="7" >Julio</option>
                                    <option value="8" >Agosto</option>
                                    <option value="9" >Septiembre</option>
                                    <option value="10" >Octubre</option>
                                    <option value="11" >Noviembre</option>
                                    <option value="12" >Diciembre</option>
                                </Field>
                                <ErrorMessage name="month" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>País:</label>
                                <Autocomplete
                                    id="codeCountry"
                                    open={openCountries}
                                    onOpen={() => {
                                        setOpenCountries(true);
                                    }}
                                    onClose={() => {
                                        setOpenCountries(false);
                                    }}
                                    isOptionEqualToValue={(option, value) => option.code === value?.code}
                                    getOptionLabel={(option) => option.name || ""}
                                    options={countryOptions}
                                    loading={loadingCountries}
                                    onChange={(_event, data) =>
                                        handleChange({ target: { name: "codeCountry", value: data?.code ?? "" } })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Selecciona un país"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loadingCountries ? (
                                                            <CircularProgress color="inherit" size={20} />
                                                        ) : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                            error={Boolean(errors.codeCountry)}
                                            helperText={errors.codeCountry?.message}
                                        />
                                    )}
                                />
                                <ErrorMessage name="codeCountry" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Locación:</label>
                                <Autocomplete
                                    id="idLocation"
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
                                    options={options}
                                    loading={loading}
                                    onChange={(_event, data) => handleChange({ target: { name: 'idLocation', value: data?.id ?? '' } })}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Selecciona una locación"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <React.Fragment>
                                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </React.Fragment>
                                                ),
                                            }}
                                            error={Boolean(errors.idLocation)}
                                            helperText={errors.idLocation?.message}
                                        />
                                    )}
                                />
                                <ErrorMessage name="idLocation" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Días:</label>
                                <Field
                                    type="text"
                                    name="daysOfWeek"
                                    as="select"
                                    onChange={handleChange}
                                    value={values.daysOfWeek}
                                    style={selectStyle}
                                >
                                    <option value="" >Seleccione dias</option>
                                    <option value="1">Sábado</option>
                                    <option value="2">Domingo</option>
                                    <option value="3">Sábado y Domingo</option>
                                </Field>
                                <ErrorMessage name="daysOfWeek" component={ErrorText} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop:'10px'}}>
                                <Button onClick={onClose} color="secondary" variant="contained" style={{ marginRight: 10, color: 'white' }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary" style={{ color: 'white' }}>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    )
}