import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {FormControlLabel, Portal, Snackbar, Switch, TextField} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import useStateContext from "../../../../context/custom/useStateContext";
import Alert from "@mui/material/Alert";

const validationSchema = yup.object({
    phoneNumber: yup
        .string()
        .matches(/^\d+$/, 'El número de teléfono solo debe contener dígitos')
        .min(10, 'El número de teléfono debe tener al menos 10 dígitos')
        .required('Se requiere el número de teléfono'),
    phoneType: yup.string().required('Se requiere el tipo de teléfono'),
    isDefault: yup.boolean().required('Por favor, selecciona si es predeterminado o no'),
});

const PhoneCreationForm = () => {

    const {context, setContext} = useStateContext();
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);

    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            phoneNumber: '',
            phoneType: '',
            isDefault: false,
        },
    });

    const phoneTypes = [
        {label: 'Casa', value: 'HOM'},
        {label: 'Móvil', value: 'MOB'},
        {label: 'Oficina', value: 'OFF'},
        {label: 'Otro', value: 'OTH'},
    ];


    const onSubmit = (data, event) => {

        if (context.phones && Array.isArray(context.phones)) {
            const phoneNumberExists = context.phones.some(
                (phone) => phone.phoneNumber && phone.phoneNumber === data.phoneNumber
            );
            if (phoneNumberExists) {
                setShowErrorSnackbar(true);
                return; // Exit the function if the phone number already exists
            } else {
                const updatedPhones = Array.isArray(context.phones)
                    ? [...context.phones, data]
                    : [data];

                setContext({
                    ...context.phones,
                    phones: updatedPhones,
                });
            }
        } else {
            setContext({
                ...context.phones,
                phones: [data],
            });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{fontWeight: 'bold'}}>
                            Crear Teléfono
                        </SoftTypography>
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="phoneNumber"
                                    label="Número de Teléfono"
                                    {...field}
                                    error={Boolean(errors.phoneNumber)}
                                    helperText={errors.phoneNumber?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="phoneType"
                            control={control}
                            render={({field}) => (

                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Tipo de Teléfono"
                                    select
                                    error={Boolean(errors.phoneType)}
                                    helperText={errors.phoneType?.message}
                                >
                                    {phoneTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <FormControlLabel
                            control={
                                <Controller
                                    name="isDefault"
                                    control={control}
                                    render={({field}) => (
                                        <Switch
                                            {...field}
                                            color="primary"
                                            checked={field.value}
                                            value={field.value}
                                        />
                                    )}
                                />
                            }
                            label="Predeterminado"
                        />
                    </Box>

                    <Box gridColumn="span 12">

                        <Button color="primary" variant="contained" fullWidth type="button"
                                onClick={handleSubmit(onSubmit)}>
                            Asignar Teléfono
                        </Button>
                    </Box>
                </Box>
            </form>
            {/* Snackbar for displaying error */}
            {showErrorSnackbar && (
                <Portal>
                    <Snackbar
                        open={showErrorSnackbar}
                        autoHideDuration={6000}
                        onClose={() => setShowErrorSnackbar(false)}
                    >
                        <Alert onClose={() => setShowErrorSnackbar(false)} severity="error">
                            El número de teléfono ya existe
                        </Alert>
                    </Snackbar>
                </Portal>
            )}
        </div>
    );
};

export default PhoneCreationForm;
