
import { Box, Button, MenuItem, Select, TextField, Popover, IconButton } from "@mui/material";
import SoftTypography from "../../../../components/SoftTypography";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {createAPIEndpoint, ENDPOINTS} from "../../../../api";

const schema = yup.object().shape({
    // Define your validation rules for each field here
    state: yup.string().optional("State is required"),
    documentId: yup.string().optional("DocumentId is required"),
});

const stateOptions = [
    { value: "ACT", label: "Activo" },
    { value: "INA", label: "Inactivo" },
    { value: "SUS", label: "Suspendido" },
    { value: "BLO", label: "Bloqueado" },
];

export const SearchClientForm = () => {
    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isStateFieldEnabled, setStateFieldEnabled] = useState(true);
    const [isDocumentIdFieldEnabled, setDocumentIdFieldEnabled] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleStateFieldToggle = () => {
        setStateFieldEnabled(!isStateFieldEnabled);
        handleClose();
    };

    const handleDocumentIdFieldToggle = () => {
        setDocumentIdFieldEnabled(!isDocumentIdFieldEnabled);
        handleClose();
    };

    const onSubmit = (data) => {
        createAPIEndpoint(ENDPOINTS.accounts).
        console.log(data);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <SoftTypography align="center" sx={{ fontWeight: 'bold' }}>
                            Busqueda de Clientes <SearchIcon />
                        </SoftTypography>
                    </Box>
                    <Box gridColumn="span 12">
                        <Controller
                            name="state"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    select
                                    fullWidth
                                    label="Estado"
                                    variant="outlined"
                                    disabled={!isStateFieldEnabled}
                                    {...field}
                                    error={!!errors.state}
                                    helperText={errors.state?.message}
                                >
                                    {stateOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>
                    <Box gridColumn="span 12">
                        <Controller
                            name="documentId"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    fullWidth
                                    label="Documento de Identidad"
                                    variant="outlined"
                                    disabled={!isDocumentIdFieldEnabled}
                                    {...field}
                                    error={!!errors.documentId}
                                    helperText={errors.documentId?.message}
                                />
                            )}
                        />
                    </Box>
                    <Box gridColumn="span 12" sx={{ textAlign: 'center' }}>
                        <IconButton onClick={handleClick}>
                            <SettingsIcon />
                        </IconButton>
                        <Popover
                            open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <Box p={2}>
                                <IconButton onClick={handleStateFieldToggle}>
                                    <SettingsIcon /> Habilitar/Deshabilitar Estado
                                </IconButton>
                                <IconButton onClick={handleDocumentIdFieldToggle}>
                                    <SettingsIcon /> Habilitar/Deshabilitar Documento de Identidad
                                </IconButton>
                            </Box>
                        </Popover>
                    </Box>
                    <Box gridColumn="span 12" sx={{ textAlign: 'center' }}>
                        <Button type="submit" variant="contained" color="primary">
                            Enviar
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};
