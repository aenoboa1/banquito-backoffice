import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import Box from "@mui/material/Box";

const BranchUpdate = ({ branchData, onSubmit, isOpen, onClose }) => {
    const [name, setName] = useState(branchData.name);
    const [emailAddress, setEmailAddress] = useState(branchData.emailAddress);
    const [phoneNumber, setPhoneNumber] = useState(branchData.phoneNumber);


    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedBranch = {
            name: name,
            emailAddress: emailAddress,
            phoneNumber: phoneNumber,
        };
        onSubmit(updatedBranch);
    };

    const handleCancel = () => {
        onClose(); // Llamar a la función onClose para cerrar el formulario sin guardar cambios
    };

    return (

        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >

                <TextField
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ marginLeft: 200}}
                />
                <TextField
                    label="Correo"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                />
                <TextField
                    label="Teléfono"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <Button onClick={handleSubmit} type="submit" variant="contained" color="primary" style={{ marginRight: 10, color: 'white' }}>
                    Actualizar
                </Button>
                <Button onClick={handleCancel} color="secondary" variant="contained" style={{ marginRight: 10, color: 'white' }}>
                    Cancelar
                </Button>

        </Box>
    );
};

export default BranchUpdate;
