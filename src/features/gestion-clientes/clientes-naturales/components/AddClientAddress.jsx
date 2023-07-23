import React, {useContext} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {TextField, Slider, Switch, FormControlLabel, Button, Box, Select} from '@mui/material';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup";
import MenuItem from "@mui/material/MenuItem";
import useStateContext from "../../../../context/custom/useStateContext";

const validationSchema = yup.object({
    typeAddress: yup.string().required('Type of Address is required'),
    line1: yup.string().required('Address Line 1 is required'),
    latitude: yup.number().required('Latitude is required'),
    longitude: yup.number().required('Longitude is required'),
});

const AddressCreationForm = () => {

    const {context, setContext} = useStateContext();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            typeAddress: '',
            line1: '',
            line2: '',
            latitude: 0,
            longitude: 0,
            isDefault: false,
        },
    });

    const onSubmit = (data) => {
        const updatedAddresses = Array.isArray(context.addresses)
            ? [...context.addresses, data]
            : [data];

            setContext({
                ...context.addresses,
                addresses: updatedAddresses,
            });

    };

    const typeAddress = [
        { label: 'Casa', value: 'HOM' },
        { label: 'Oficina', value: 'OFF' },
        { label: 'Otro', value: 'OTH' },
    ];

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Address Creation
                        </SoftTypography>
                    </Box>


                    <Box gridColumn="span 12">
                        <Controller
                            name="typeAddress"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.typeAddress)}
                                    helperText={errors.typeAddress?.message}
                                >
                                    {typeAddress.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="line1"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="line1"
                                    label="Address Line 1"
                                    {...field}
                                    error={Boolean(errors.line1)}
                                    helperText={errors.line1?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="line2"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="text"
                                    id="line2"
                                    label="Address Line 2"
                                    {...field}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="latitude"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="number"
                                    id="latitude"
                                    label="Latitude"
                                    {...field}
                                    error={Boolean(errors.latitude)}
                                    helperText={errors.latitude?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="longitude"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    type="number"
                                    id="longitude"
                                    label="Longitude"
                                    {...field}
                                    error={Boolean(errors.longitude)}
                                    helperText={errors.longitude?.message}
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="isDefault"
                            control={control}
                            render={({ field }) => (
                                <FormControlLabel
                                    control={<Switch {...field} color="primary" />}
                                    label="Is Default?"
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Create Address
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};

export default AddressCreationForm;
