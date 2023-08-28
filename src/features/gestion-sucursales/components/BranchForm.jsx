import React, {useState} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Modal, Button, TextField, Typography, Box } from '@mui/material';
import 'flatpickr/dist/themes/light.css';
import {createAPIEndpoint, ENDPOINTS} from "./../../../api/index";

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

const ErrorText = ({ children }) => <div style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{children}</div>;

export default function BranchForm({ isOpen, onClose, onSubmit, handleAddBranch }) {
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeModalWithDelay = () => {
        setIsSubmitting(false);
        setTimeout(() => {
            onClose();
        }, 5000);
    };


    const submit = (data) => {
        setIsSubmitting(true);
        createAPIEndpoint(ENDPOINTS.bankEntity)
            .putBranchCreate(data)
            .then((response) => {
                closeModalWithDelay();
                onSubmit(); // Llamar a la función onSubmit del componente padre para actualizar la lista de sucursales
                // Llamar a handleAddBranch para actualizar la tabla con la nueva sucursal
                handleAddBranch({
                    name: data.name,
                    emailAddress: data.emailAddress,
                    phoneNumber: data.phoneNumber,
                    line1: data.line1,
                    state: 'ACTIVO', // Asignar el estado como 'ACTIVO' por defecto para una nueva sucursal
                    uniqueKey: response.data.uniqueKey, // Opcional: si tienes un identificador único para cada sucursal
                });
            })
            .catch((error) => {
                setError("Datos duplicados, solicitud rechazada");
                setIsSubmitting(false);
            });
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div style={modalStyle}>
                <Typography variant="h5" gutterBottom>
                    <Box sx={{ textAlign: 'center', m: 1 }}>Ingresar nueva Sucursal</Box>
                </Typography>
                {error && <div style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{error}</div>}
                <Formik
                    initialValues={{
                        name: '',

                        emailAddress: '',
                        phoneNumber: '',
                        locationId: '',
                        line1: '',
                        latitude: '',
                        longitude: ''
                    }}
                    validate={(values) => {
                        let errors = {};
                        if (!values.name) errors.name = 'Debe ingresar el nombre de la Sucursal';

                        if (!values.emailAddress) errors.emailAddress = 'Debe ingresar un correo para la Sucursal';
                        if (!values.phoneNumber) errors.phoneNumber = 'Debe ingresar un teléfono para la Sucursal';
                        if (!values.locationId) errors.locationId = 'Debe ingresar una localización para la Sucursal';
                        if (!values.line1) errors.line1 = 'Debe ingresar una dirección para la Sucursal';
                        if (!values.latitude) errors.latitude = 'Debe ingresar una latitud para la Sucursal';
                        if (!values.locationId) errors.longitude = 'Debe ingresar una longitud para la Sucursal';
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
                                <label>Correo:</label>
                                <Field
                                    type="text"
                                    name="emailAddress"
                                    as={TextField}
                                    onChange={handleChange}
                                    value={values.emailAddress}
                                    fullWidth
                                />
                                <ErrorMessage name="emailAddress" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Teléfono:</label>
                                <Field
                                    type="text"
                                    name="phoneNumber"
                                    as={TextField}
                                    onChange={handleChange}
                                    value={values.phoneNumber}
                                    fullWidth
                                />
                                <ErrorMessage name="phoneNumber" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Localización:</label>
                                <Field
                                    type="text"
                                    name="locationId"
                                    as={TextField}
                                    onChange={handleChange}
                                    value={values.locationId}
                                    fullWidth
                                />
                                <ErrorMessage name="locationId" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Dirección:</label>
                                <Field
                                    type="text"
                                    name="line1"
                                    as={TextField}
                                    onChange={handleChange}
                                    value={values.line1}
                                    fullWidth
                                />
                                <ErrorMessage name="line1" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Latitud:</label>
                                <Field
                                    type="text"
                                    name="latitude"
                                    as={TextField}
                                    onChange={handleChange}
                                    value={values.latitude}
                                    fullWidth
                                />
                                <ErrorMessage name="latitude" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Longitud:</label>
                                <Field
                                    type="text"
                                    name="longitude"
                                    as={TextField}
                                    onChange={handleChange}
                                    value={values.longitude}
                                    fullWidth
                                />
                                <ErrorMessage name="longitude" component={ErrorText} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop:'10px'}}>
                                <Button onClick={onClose} color="secondary" variant="contained" style={{ marginRight: 10, color: 'white' }}>
                                    Cancelar
                                </Button>
                                <Button type="submit" variant="contained" color="primary" style={{ color: 'white' }} disabled={isSubmitting}>
                                    Agregar
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}
