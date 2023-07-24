import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
    Box, Button, Card, CardContent, Divider, Grid, MenuItem, Modal, TextField, Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';


const validationSchema = yup.object({
    
    listClient: yup.string().required('Cliente es requerido'),
});

const Accounts = () => {

    const navigate = useNavigate();
    const [accountType, setAccountType] = useState('');
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            typeAccount: '',
            listClient: '',
        },
    });

    const accountTypes = [
        { label: 'Corriente', value: 'CUR' },
        { label: 'Ahorros', value: 'SAV' },
        { label: 'Programado', value: 'SCH' },
    ];

    const clientsList = [
        { label: 'Cliente 1', value: 'CID1' },
        { label: 'Cliente 2', value: 'CID2' },
        { label: 'Cliente 3', value: 'CID3' },
    ];

    const onSubmit = (data, event) => {
        handleOpen();
        console.log(data);
    };

    const style = {
        position: "absolute",
        top: "18rem",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "#f7f8f9", // Color
        boxShadow: 5,
        borderRadius: '3px',
        p: 4
    };

    const handleNavigateToAccount = () => {
        handleClose();
        navigate('/pais');
    };

    return (
        <div>
            <Grid item xs={10}>
                <Box
                    display="flex"
                    justifyContent="center"
                >
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={style}>
                            <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                                <Box gridColumn="span 6">
                                    <Controller
                                        name="listClient"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label="Clientes"
                                                select
                                                error={Boolean(errors.listClient)}
                                                helperText={errors.listClient?.message}
                                            >
                                                {clientsList.map((type) => (
                                                    <MenuItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        )}
                                    />
                                </Box>

                                <Box gridColumn="span 6">
                                    <TextField
                                        fullWidth
                                        label="Tipo de cuenta"
                                        select
                                        onChange={(e) => setAccountType(e.target.value)}
                                        value={accountType}
                                        
                                    >
                                        {accountTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>

                                <Box gridColumn="span 12">
                                    {accountType && (
                                        <Box display="flex" justifyContent="center" my={2}>
                                            <Card sx={{ minWidth: 300 }}>
                                                <CardContent>
                                                    <Typography variant="h6" gutterBottom>
                                                        <span>{accountType}</span><span style={{ marginLeft: '7rem' }}>1234567890</span>
                                                    </Typography>
                                                    <Divider sx={{ my: 1, height: 2 }} />
                                                    <Typography variant="body2" gutterBottom>
                                                        Saldo disponible<span style={{ marginLeft: '3rem' }}>$1909.09</span>
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Box>)}
                                </Box>

                                <Box gridColumn="span 12">
                                    <Button color="primary" variant="contained" fullWidth type="submit">
                                        Asignar
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Grid>
            {
                open &&
                <div>
                    <Modal
                        keepMounted
                        open={open}
                        onClose={false}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box sx={style}>
                                <Typography sx={{ mb: 0.5, lineHeight: '2rem', }} color="text.primary" align='center'
                                    fontSize={30}>
                                    <span style={{ fontWeight: 'bold' }}>
                                        ASIGNADO
                                    </span>
                                </Typography>
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <img src="ok.png" alt="ok" style={{ width: '50%', height: 'auto', }} />
                                </div>
                                <Divider sx={{ backgroundColor: "#000" }} />
                                <div>
                                    <Button
                                        type="submit"
                                        style={{
                                            backgroundColor: '#00202E',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            color: '#fff',
                                            marginLeft: '8rem'
                                        }}
                                        onClick={handleNavigateToAccount}
                                    >
                                        REGRESAR
                                    </Button>
                                </div>
                            </Box>
                        </div>
                    </Modal>
                </div>
            }
        </div >
    );
};

export default Accounts;