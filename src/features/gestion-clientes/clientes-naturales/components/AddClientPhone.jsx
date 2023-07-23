import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Select, TextField, Switch, FormControlLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import useStateContext from "../../../../context/custom/useStateContext";

const validationSchema = yup.object({
    phoneNumber: yup
        .string()
        .matches(/^\d+$/, 'Phone number should only contain digits')
        .min(10, 'Phone number should be at least 10 digits long')
        .required('Phone Number is required'),
    phoneType: yup.string().required('Phone Type is required'),
    isDefault: yup.boolean().required('Please select whether it is default or not'),
});

const PhoneCreationForm = () => {

    const {context, setContext} = useStateContext();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            phoneNumber: '',
            phoneType: '',
            isDefault: false,
        },
    });

    const phoneTypes = [
        { label: 'Casa', value: 'HOM' },
        { label: 'Móvil', value: 'MOB' },
        { label: 'Oficina', value: 'OFF' },
        { label: 'Otro', value: 'OTH' },
    ];

    const onSubmit = (data) => {
        setContext({
            phoneNumber: data.phoneNumber,
            phoneType: data.phoneType,
            isDefault: data.isDefault,
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Crear Teléfono
                        </SoftTypography>
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="phoneNumber"
                            control={control}
                            render={({ field }) => (
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
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.phoneType)}
                                    helperText={errors.phoneType?.message}
                                >
                                    {phoneTypes.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <FormControlLabel
                            control={
                                <Controller
                                    name="isDefault"
                                    control={control}
                                    render={({ field }) => (
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
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Asignar Teléfono
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};

export default PhoneCreationForm;
