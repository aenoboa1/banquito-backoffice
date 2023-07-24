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

export default function BranchCreate({ isOpen, onClose, onSubmit }) {
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const closeModalWithDelay = () =>{
        setIsSubmitting(false);
        setTimeout(()=>{
            onClose();
        }, 5000);
    }
    const submit =(data) =>{
        setIsSubmitting(true);
        createAPIEndpoint(ENDPOINTS.bankEntity,
        ).postBranch(data,{

        }).then(() =>{
            closeModalWithDelay()
        }).catch(() => {
                setError("Datos duplicados, solicitud rechazada");
                setIsSubmitting(false);
            }
        );
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
                        code: '',
                        emailAddress: ''
                    }}
                    validate={(values) => {
                        let errors = {};
                        if (!values.name) errors.name = 'Debe ingresar el nombre de la Sucursal';
                        if (!values.code) errors.code = 'Debe ingresar un código para la Sucursal';
                        if (!values.emailAddress) errors.emailAddress = 'Debe seleccionar el tipo de feriado';
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
                                <label>Código:</label>
                                <Field
                                    type="text"
                                    name="code"
                                    as={TextField}
                                    onChange={handleChange}
                                    value={values.code}
                                    fullWidth
                                />
                                <ErrorMessage name="code" component={ErrorText} />
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

                            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop:'10px'}}>
                                <Button onClick={onClose} color="secondary" variant="contained" style={{ marginRight: 10, color: 'white' }}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="contained" color="primary" style={{ color: 'white' }} disabled={isSubmitting}>
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    );
}