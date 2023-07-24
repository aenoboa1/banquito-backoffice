import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import {createAPIEndpoint, ENDPOINTS} from "../../../../api";

// Define validation schema using yup
const schema = yup.object().shape({
    status: yup.string().required('Status is required'),
    documentId: yup.string(),
});

export default function CustomizedInputBase() {
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });

    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isFilterDisabled, setIsFilterDisabled] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const onSubmit = (data) => {
        console.log(data);
        handleCloseModal();
    };

    const handleFilterMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleFilterMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDisableFilter = () => {
        setIsFilterDisabled(true);
        handleFilterMenuClose();
    };

    const handleEnableFilter = () => {
        setIsFilterDisabled(false);
        handleFilterMenuClose();
    };

    const [openBranches, setOpenBranches] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = openBranches && options.length === 0;

    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {

                createAPIEndpoint(ENDPOINTS.bankEntity).fetchBranches('64b1892b9c2c3b03c33a736f'
                    ,
                    {}
                ).then(
                    res => {
                        console.log(res.data);
                        setOptions(res.data);

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
        if (!openBranches) {
            setOptions([]);
        }
    }, [openBranches]);

    return (
        <>
            <IconButton type="button" onClick={handleOpenModal} aria-label="filter">
                <SearchIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleFilterMenuClose}
            >
                <MenuItem onClick={handleDisableFilter}>Disable Filter</MenuItem>
                <MenuItem onClick={handleEnableFilter}>Enable Filter</MenuItem>
            </Menu>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 250, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
                    <h2>Status Filter</h2>

                    <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <form onSubmit={handleSubmit(onSubmit)}>

                        <Box gridColumn="span 12">
                        <FormControl fullWidth variant="outlined" error={!!errors.status}>
                            <InputLabel>Status</InputLabel>
                            <Controller
                                name="status"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        label="Status"
                                    >
                                        <MenuItem value="ACT">Active</MenuItem>
                                        <MenuItem value="SUS">Suspended</MenuItem>
                                        <MenuItem value="BLO">Blocked</MenuItem>
                                        <MenuItem value="INA">Inactive</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.status && <p>{errors.status.message}</p>}
                        </FormControl>
                        </Box>

                        {!isFilterDisabled && (

                            <Box gridColumn="span 12">
                            <Controller
                                name="documentId"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Document ID (Optional)"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.documentId}
                                        helperText={errors.documentId?.message}
                                    />
                                )}
                            />
                            </Box>
                        )}


                        <Box gridColumn="span 12">
                            <Controller
                                name="branchId"
                                control={control}
                                render={({field}) => (
                                    <Autocomplete

                                        id="branchId"
                                        open={openBranches}
                                        onOpen={() => {
                                            setOpenBranches(true);
                                        }}
                                        onClose={() => {
                                            setOpenBranches(false);
                                        }}

                                        getOptionSelected={(option, value) =>
                                            value === undefined || value === "" || option.code === value.code
                                        }
                                        isOptionEqualToValue={(option, value) => option.code === value?.code}
                                        getOptionLabel={(option) => option.name || ''}
                                        fullWidth
                                        options={options}
                                        loading={loading}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Seleccione una Sucursal"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    endAdornment: (
                                                        <React.Fragment>
                                                            {loading ?
                                                                <CircularProgress color="inherit" size={20}/> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                }}
                                                error={Boolean(errors.branchId)}
                                                helperText={errors.branchId?.message}
                                            />
                                        )}
                                        onChange={(_event, data) => field.onChange(data?.code ?? '')}
                                    />
                                )}
                            />

                    </Box>


                        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Submit</Button>
                    </form>
                        </Box>
                </Box>
            </Modal>
        </>
    );
}
