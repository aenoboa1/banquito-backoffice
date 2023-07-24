import React, { useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Slider, Switch, FormControlLabel, Button, Box, Select, InputAdornment } from '@mui/material';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import MenuItem from "@mui/material/MenuItem";
import useStateContext from "../../../../context/custom/useStateContext";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { Business } from "@mui/icons-material";
import { createAPIEndpoint, ENDPOINTS } from "../../../../api";

const validationSchema = yup.object({
    typeAddress: yup.string().optional('Tipo de dirección requerido'),
    line1: yup.string().optional('Dirección línea 1 requerida'),
    latitude: yup.number().optional('Latitud requerida'),
    longitude: yup.number().optional('Longitud requerida'),
    locationId: yup.string().required('Provincia requerida'),
});

const AddressCreationForm = () => {

    const { context, setContext } = useStateContext();


    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    const [openLocations, setOpenLocations] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = openLocations && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {
                createAPIEndpoint(ENDPOINTS.geoStructure).fetchProvinceByCountry(
                    'ECU',
                    '2'
                ).then(
                    (res) => {
                        
                        console.log(res.data.locations)

                        setOptions(res.data.locations)

                    }).then(
                        err => console.log(err)
                    )
            }
        })();

        return () => {
            active = false;
        };
    }, [loading]);

    React.useEffect(() => {
        if (!openLocations) {
            setOptions([]);
            
        }
    }, [openLocations]);

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
            locationId: '',
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
                            Creación de Dirección
                        </SoftTypography>
                    </Box>

                    <Box gridColumn="span 12">
                        <Controller
                            name="typeAddress"
                            control={control}
                            render={({ field }) => (

                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Tipo de Dirección"
                                    select
                                    error={Boolean(errors.typeAddress)}
                                    helperText={errors.typeAddress?.message}
                                >
                                    {typeAddress.map((type) => (
                                        <MenuItem key={type.value} value={type.value}>
                                            {type.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Grid item xs={12}>
                            {/* Branch */}
                            <Controller
                                name="locationId"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        id="locationId"
                                        open={openLocations}
                                        onOpen={() => {
                                            setOpenLocations(true);
                                        }}
                                        onClose={() => {
                                            setOpenLocations(false);
                                        }}

                                        isOptionEqualToValue={(option, value) => option.id === value?.id}
                                        getOptionLabel={(option) => option.name || ''} 
                                        groupBy={(option) => option.firstLetter}

                                        fullWidth
                                        options={options}
                                        loading={loading}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Selecciona un cantón"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={Boolean(errors.locationId)}
                                                helperText={errors.locationId?.message}
                                            />
                                        )}
                                        onChange={(_event, data) => field.onChange(data?.id ?? '')}
                                    />
                                )}
                            />
                        </Grid>
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
                                    label="Dirección Línea 1"
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
                                    label="Dirección Línea 2"
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
                                    label="Latitud"
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
                                    label="Longitud"
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
                                    label="¿Es la predeterminada?"
                                />
                            )}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Crear Dirección
                        </Button>
                    </Box>
                </Box>
            </form>
        </div>
    );
};

export default AddressCreationForm;
