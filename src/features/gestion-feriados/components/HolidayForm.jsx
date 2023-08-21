import React, {useEffect, useState} from 'react';
import { Formik, Form, Field, ErrorMessage, useFormik } from 'formik';
import { Modal, Button, TextField, Typography, Box, Alert, AlertTitle } from '@mui/material';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';
import {createAPIEndpoint, ENDPOINTS} from "./../../../api/index";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

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

const flatpickrStyle ={
    ...selectStyle,
};

const ErrorText = ({ children }) => <div style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{children}</div>;

export default function HolidayForm({ isOpen, onClose, onSubmit }) {
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const [openLocations, setOpenLocations] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);

    const [openCountries, setOpenCountries] = useState(false);
    const [countryOptions, setCountryOptions] = useState([]);
    const [loadingCountries, setLoadingCountries] = useState(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState('');
    const [selectedLocationType, setSelectedLocationType] = useState('');

    useEffect(() => {
        if (openLocations && selectedCountryCode !== '' && selectedLocationType) {
            setLoading(true);
            setOptions([]);
            fetchLocations(selectedCountryCode, selectedLocationType)
                .then((res) => {
                    if(res.locations){
                        console.log(res.locations);
                        setOptions(res.locations);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [openLocations, selectedCountryCode, selectedLocationType]);

    const fetchLocations = (countryCode, locationType) => {
        return createAPIEndpoint(ENDPOINTS.geoStructure)
            .fetchProvinceByCountry(countryCode, locationType)
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

    const closeModalWithDelay = () =>{
        setIsSubmitting(false);
        setSuccessMessage('Feriado creado correctamente');
        setTimeout(()=>{
            onClose();
        }, 3000);
    }
    const submit =(data) =>{
        console.log(data);

        if (data.type === "REG" && !data.idLocation) {
            setError("No se puede seleccionar un tipo 'Regional' sin una ubicación");
            return;
        }

        if(!data.idLocation){
            data.idLocation = 0;
        }

        console.log("Data editado el idLocation",data);

        setIsSubmitting(true);
        createAPIEndpoint(ENDPOINTS.holiday,
            ).postHoliday(data,data.codeCountry,data.idLocation,'TOKEN',{

        }).then(() =>{
            setSuccessMessage('Feriado creado correctamente');
            closeModalWithDelay()
        }).catch(() => {
                setError("Datos duplicados, solicitud rechazada");
                setIsSubmitting(false);
            }
        );
    };

    return (
        <Modal open={isOpen} onClose={() => {
            onClose();
            setError(null);
            setSuccessMessage(null);
        }}>
            <div style={modalStyle}>
                <Typography variant="h5" gutterBottom>
                    <Box sx={{ textAlign: 'center', m: 1 }}>Ingresar nuevo Feriado</Box>
                </Typography>
                {error && <div style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{error}</div>}
                <Formik
                    initialValues={{
                        holidayDate: '',
                        name: '',
                        type: '',
                        codeCountry:'',
                        idLocation:'',
                        locationType: ''
                    }}
                    validate={(values) => {
                        let errors = {};
                        if (!values.holidayDate) errors.holidayDate = 'Debe ingresar una fecha para el feriado';
                        if (!values.name) errors.name = 'Debe ingresar el nombre del feriado';
                        if (!values.type) errors.type = 'Debe seleccionar el tipo de feriado';
                        if (!values.codeCountry) errors.codeCountry = 'Debe escribir un país';
                        else if(values.type === '') errors.type = 'Debe seleccionar una opción válida';
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
                                <label>Fecha:</label>
                                <Flatpickr
                                    name="holidayDate"
                                    value={values.holidayDate}
                                    style={flatpickrStyle}
                                    onChange={(date) => handleChange({ target: { name: 'holidayDate', value: date[0] } })}
                                />
                                <ErrorMessage name="holidayDate" component={ErrorText} />
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
                                    onChange={(_event, data) => {
                                        handleChange({ target: { name: "codeCountry", value: data?.code ?? "" } })
                                        setSelectedCountryCode(data?.code || '');
                                    }}
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
                                <label>Tipo de Ubicación:</label>
                                <Field
                                    type="text"
                                    name="locationType"
                                    as="select"
                                    onChange={(e) =>{
                                        handleChange(e);
                                        setSelectedLocationType(e.target.value);
                                    }}
                                    style={selectStyle}
                                    value={values.locationType}
                                >
                                    <option value="">Seleccione un tipo</option>
                                    <option value="1">Provincia</option>
                                    <option value="2">Cantón</option>
                                    <option value="3">Parroquia</option>
                                </Field>
                                <ErrorMessage name="locationType" component={ErrorText} />
                            </div>
                            {values.locationType && (
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
                            )}
                            <div className="form-group">
                                <label>Nombre:</label>
                                <Field
                                    type="text"
                                    name="name"
                                    as={TextField}
                                    onChange={handleChange}
                                    value={values.name}
                                    fullWidth
                                />
                                <ErrorMessage name="name" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Tipo:</label>
                                <Field
                                    type="text"
                                    name="type"
                                    as="select"
                                    onChange={handleChange}
                                    style={selectStyle}
                                    value={values.type}
                                >
                                    <option value="" >Seleccione un tipo</option>
                                    <option value="NAT" >Nacional</option>
                                    <option value="REG" >Regional</option>
                                </Field>
                                <ErrorMessage name="type" component={ErrorText} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop:'10px'}}>
                                <Button onClick={onClose} color="secondary" variant="contained" style={{ marginRight: 10, color: 'white' }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary" style={{ color: 'white' }} disabled={isSubmitting}>
                                    Añadir
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
                {successMessage && (
                    <Alert severity="success">
                        <AlertTitle>Éxito</AlertTitle>
                        {successMessage}
                    </Alert>
                )}
            </div>
        </Modal>
    );
}
