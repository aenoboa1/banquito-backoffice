import React from "react";
import {Box, Button, Modal, TextField, Typography} from "@mui/material";
import {ErrorMessage, Field, Form, Formik} from "formik";

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

export default function HolidayGenerate({ isOpen, onClose, onSubmit }) {
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
                    onSubmit={onSubmit}
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
                                <Field
                                    type="text"
                                    name="codeCountry"
                                    placeholder="Ej: Ecuador"
                                    as={TextField}
                                    onChange={handleChange}
                                    value = {values.codeCountry}
                                    fullWidth
                                />
                                <ErrorMessage name="codeCountry" component={ErrorText} />
                            </div>
                            <div className="form-group">
                                <label>Locación:</label>
                                <Field
                                    type="text"
                                    name="idLocation"
                                    placeholder="Ej: Santa Elena"
                                    as={TextField}
                                    onChange={handleChange}
                                    value = {values.codeCountry}
                                    fullWidth
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