import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Alert, Portal, Snackbar, TextField, } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import useStateContext from "../../../../context/custom/useStateContext";

const validationSchema = yup.object({
    clientList: yup.string().required('El cliente es necesario'),
    roleType: yup.string().required('El rol es necesario'),
});

const AddMemberForm = ({ setIsActive }) => {
    const [showErrorSnackbar, setShowErrorSnackbar] = useState(false);
    const { context, setContext } = useStateContext();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            roleType: '',
            clientList: '',
        },
    });

    const clientsList = [
        { label: 'Cliente 1', value: 'CID1' },
        { label: 'Cliente 2', value: 'CID2' },
        { label: 'Cliente 3', value: 'CID3' },
    ];

    const rolesType = [
        { label: 'Representante legal', value: 'RL' },
        { label: 'Accionista', value: 'ACC' },
        { label: 'Apoderado', value: 'APO' },
    ];

    const onSubmit = (data, event) => {
        if (context.members && Array.isArray(context.members)) {
            const membersExists = context.members.some(
                (member) => member.roleType && member.roleType === data.roleType
            );
            if (membersExists) {
                setShowErrorSnackbar(true);
                return; // Exit the function if the phone number already exists
            } else {
                const updatedMembers = Array.isArray(context.members)
                    ? [...context.members, data]
                    : [data];
                setContext({
                    ...context.members,
                    members: updatedMembers,
                });
            }
        } else {
            setContext({
                ...context.members,
                members: [data],
            });
        }
    };

    const handleOpen = () => {
        setIsActive(false);
    }

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 2fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Agregar
                        </SoftTypography>
                    </Box>

                    <Box gridColumn="span 6">
                        <Controller
                            name="clientList"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    select // tell TextField to render select
                                    label="Lista de Clientes"
                                    error={Boolean(errors.clientList)}
                                    helperText={errors.clientList?.message}
                                >
                                    {clientsList.map((type) => (
                                        <MenuItem key={type.value} value={type.label}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 6">
                        <Controller
                            name="roleType"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    select // tell TextField to render select
                                    label="Tipo de roles"
                                    error={Boolean(errors.roleType)}
                                    helperText={errors.roleType?.message}
                                >
                                    {rolesType.map((type) => (
                                        <MenuItem key={type.value} value={type.label}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Button color="primary" variant="contained" fullWidth type="submit"
                            onClick={handleOpen}>
                            Agregar Miembro
                        </Button>
                    </Box>
                </Box>
            </form>
            {showErrorSnackbar && (
                <Portal>
                    <Snackbar
                        open={showErrorSnackbar}
                        autoHideDuration={6000}
                        onClose={() => setShowErrorSnackbar(false)}
                    >
                        <Alert onClose={() => setShowErrorSnackbar(false)} severity="error">
                            El rol ya fue asignado.
                        </Alert>
                    </Snackbar>
                </Portal>
            )}
        </div>
    );
};

export default AddMemberForm;
