import React, { useState } from 'react';
import { Card, CardContent, Button, Box, Typography } from '@mui/material';
import HolidayForm from './HolidayForm';
import HolidayGenerate from './HolidayGenerate'
import HolidayList from './HolidayList'

export default function HolidayCard() {
    const [isModalOpenForm, setIsModalOpenForm ] = useState(false);
    const [isModalOpenGenerate, setIsModalOpenGenerate] = useState(false);

    const handleOpenModalForm = () => {
        setIsModalOpenForm(true);
    };

    const handleCloseModalForm = () => {
        setIsModalOpenForm(false);
    };

    const handleSubmitForm = (values) => {
        // Lógica para enviar el formulario
        console.log(values);
        handleCloseModalForm();
    };

    const handleOpenModalGenerate = () => {
        setIsModalOpenGenerate(true);
    };

    const handleCloseModalGenerate = () => {
        setIsModalOpenGenerate(false);
    };

    const handleSubmitGenerate = (values) => {
        // Lógica para enviar el formulario
        console.log(values);
        handleCloseModalGenerate();
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Gestión de Feriados
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="20px">
                    <Button onClick={handleOpenModalForm} variant="contained" color="primary" style={{ color: 'white' }}>
                        Agregar Feriado
                    </Button>
                    <Button onClick={handleOpenModalGenerate} variant="contained" color="primary" style={{color: 'white'}}>
                        Generar Feriados
                    </Button>
                </Box>
                <HolidayForm isOpen={isModalOpenForm} onClose={handleCloseModalForm} onSubmit={handleSubmitForm} />
                <HolidayGenerate isOpen={isModalOpenGenerate} onClose={handleCloseModalGenerate} onSubmit={handleSubmitGenerate} />
                <HolidayList></HolidayList>
            </CardContent>
        </Card>
    );
}
