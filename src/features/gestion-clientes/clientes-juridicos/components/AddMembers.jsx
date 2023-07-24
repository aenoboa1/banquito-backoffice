import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Select, TextField, Switch, FormControlLabel, InputLabel } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
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

const AddMemberForm = () => {

    const { context, setContext } = useStateContext();

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

    const clientList = [
        { label: 'Seleccione un cliente', value: '' },
        { label: 'Cliente 1', value: 'CID1' },
        { label: 'Cliente 2', value: 'CID2' },
        { label: 'Cliente 3', value: 'CID3' },
    ];

    const roleType = [
        { label: 'Seleccione un rol...', value: '' },
        { label: 'Representante legal', value: 'RL' },
        { label: 'Accionista', value: 'ACC' },
        { label: 'Apoderado', value: 'APO' },
    ];

    const onSubmit = (data) => {

        const updatedPhones = Array.isArray(context.phones)
            ? [...context.phones, data]
            : [data];

        setContext({
            ...context.phones,
            phones: updatedPhones,
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Agregar
                        </SoftTypography>
                    </Box>

                    <Box gridColumn="span 6">
                        <InputLabel style={{ marginBottom: '5px' }}>Clientes</InputLabel>
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
                                    {clientList.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 6">
                        <InputLabel style={{ marginBottom: '5px' }}>Roles</InputLabel>
                        <Controller
                            name="roleType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    fullWidth
                                    error={Boolean(errors.roleType)}
                                    helperText={errors.roleType?.message}
                                >
                                    {roleType.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Agregar Miembro
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};

export default AddMemberForm;
