import React, {useEffect, useState} from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import {Box, Modal, Typography, Button, TextField} from "@mui/material";
import {createAPIEndpoint, ENDPOINTS} from "./../../../api/index";
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

const flatpickrStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
};

const ErrorText = ({ children }) => <div style={{ color: 'red', fontSize: '12px', textAlign: 'center' }}>{children}</div>;


export default function HolidayEdit({ isOpen, onClose, selectedHolidayId, updateHolidayInTable }) {
    const [holidayData, setHolidayData] = useState(null);
    const [userPermissions, setUserPermissions] = useState({
        canEditHolidayDate: true,
        canEditName: true,
        canEditType: true,
    });

    const [isTypeEditable, setIsTypeEditable] = useState(true);

    useEffect(() => {
        if (isOpen && selectedHolidayId) {
            const holidayEndpoint = createAPIEndpoint(ENDPOINTS.holiday);
            holidayEndpoint.fectchHoliday(selectedHolidayId, 'TU_TOKEN')
                .then(response => {
                    setHolidayData(response.data);
                    console.log(response);
                    setIsTypeEditable(response.data.location !== null)
                })
                .catch(error => console.error('Error al obtener los datos del feriado:', error));
        }
    }, [isOpen, selectedHolidayId]);

    useEffect(() => {
        if (!isOpen) {
            setHolidayData(null);
        }
    }, [isOpen]);

    const submit = (values, formikBag) => {
        const { setSubmitting } = formikBag;

        const updatedData = {
            ...holidayData,
            holidayDate: userPermissions.canEditHolidayDate ? values.holidayDate : holidayData.holidayDate,
            name: userPermissions.canEditName ? values.name : holidayData.name,
            type: isTypeEditable ? (userPermissions.canEditType ? values.type : holidayData.type) : holidayData.type,
        };

        createAPIEndpoint(ENDPOINTS.holiday)
            .putHoliday(updatedData, 'TU_TOKEN')
            .then((response) => {
                updateHolidayInTable(response.data);
                onClose();
            })
            .catch((error) => {
                console.error('Error al actualizar el feriado:', error);
            }).finally(() => {
            setSubmitting(false);
        });
    };

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div style={modalStyle}>
                {holidayData ? (
                    <Formik
                        initialValues={{
                            holidayDate: new Date(holidayData.holidayDate).toISOString(),
                            name: holidayData.name || '',
                            type: holidayData.type || ''
                        }}
                        validate={(values) => {
                            const errors = {};
                            if (!values.holidayDate) {
                                errors.holidayDate = 'Debe ingresar una fecha para el feriado';
                            }
                            if (!values.name) {
                                errors.name = 'Debe ingresar el nombre del feriado';
                            }
                            if (!values.type) {
                                errors.type = 'Debe seleccionar el tipo de feriado';
                            }
                            return errors;
                        }}
                        onSubmit={submit}
                    >
                        {({ errors, values, handleChange }) => (
                            <Form>
                                <Typography variant="h5" gutterBottom>
                                    <Box sx={{ textAlign: 'center', m: 1 }}>Editar Feriado</Box>
                                </Typography>
                                <div>
                                    <label>Fecha:</label>
                                    <Flatpickr
                                        name="holidayDate"
                                        value={values.holidayDate}
                                        style={flatpickrStyle}
                                        onChange={(date) => {
                                            handleChange('holidayDate')(date[0].toISOString());
                                        }}
                                    />
                                    <ErrorMessage name="holidayDate" component={ErrorText} />
                                </div>
                                <div className="form-group">
                                    <label>País:</label>
                                    <TextField
                                        type="text"
                                        value={holidayData.country?.name || 'No registrado'}
                                        disabled
                                        fullWidth
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Locación:</label>
                                    <TextField
                                        type="text"
                                        value={holidayData.location?.name || 'No registrado'}
                                        disabled
                                        fullWidth
                                    />
                                </div>
                                <div>
                                    <label>Nombre:</label>
                                    <TextField
                                        type="text"
                                        name="name"
                                        value={values.name}
                                        fullWidth
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage name="name" component={ErrorText} />
                                </div>
                                <div>
                                    <label>Tipo:</label>
                                    {console.log(isTypeEditable)}
                                    <select
                                        name="type"
                                        style={flatpickrStyle}
                                        value={values.type}
                                        onChange={handleChange}
                                        disabled ={!isTypeEditable}
                                    >
                                        <option value="">Seleccione un tipo</option>
                                        <option value="NAT">Nacional</option>
                                        <option value="REG">Regional</option>
                                    </select>
                                    <ErrorMessage name="type" component={ErrorText} />
                                </div>
                                <Box sx={{ textAlign: 'center', m: 1 }}>
                                    <Button type="submit" >Guardar Cambios</Button>
                                </Box>
                            </Form>
                        )}
                    </Formik>
                ) : (
                    <Typography variant="h5" gutterBottom>
                        <Box sx={{ textAlign: 'center', m: 1 }}>Cargando datos...</Box>
                    </Typography>
                )}
            </div>
        </Modal>
    );
}