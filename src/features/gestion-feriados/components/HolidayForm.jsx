import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Modal, Button, TextField, Typography, Box } from '@mui/material';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/light.css';

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
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
}

const ErrorText = ({ children }) => <div style={{ color: 'red', fontSize: '12px' }}>{children}</div>;

export default function HolidayForm({ isOpen, onClose, onSubmit }) {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <div style={modalStyle}>
                <Typography variant="h5" gutterBottom>
                    <Box sx={{ textAlign: 'center', m: 1 }}>Ingresar nuevo Feriado</Box>
                </Typography>
                <Formik
                    initialValues={{
                        holidayDate: '',
                        name: '',
                        type: ''
                    }}
                    validate={(values) => {
                        let errors = {};
                        if (!values.holidayDate) {
                            errors.holidayDate = 'Debe ingresar una fecha para el feriado';
                        }
                        if (!values.name) {
                            errors.name = 'Debe ingresar el nombre del feriado';
                        }
                        if (!values.type) {
                            errors.type = 'Debe seleccionar el tipo de feriado';
                        } else if(values.type === ''){
                            errors.type = 'Debe seleccionar una opción válida';
                        }
                        return errors;
                    }}
                    onSubmit={onSubmit}
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
                                    fullWidth
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
                                <Button type="submit" variant="contained" color="primary" style={{ color: 'white' }}>
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
