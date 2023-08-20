import React, {ReactNode, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    ButtonGroup,
    Checkbox,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    Modal,
    Stack,
    TextField
} from '@mui/material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SoftTypography from '../../../../components/SoftTypography';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import PhoneCreationForm from "./AddClientPhone";
import AddressCreationForm from "./AddClientAddress";
import {createAPIEndpoint, ENDPOINTS} from "../../../../api";
import MenuItem from "@mui/material/MenuItem";
import useStateContext from "../../../../context/custom/useStateContext";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {AccountCircle, AddCircleOutline, Business, ChatBubble, Email, ExpandMore} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";

import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import SoftButton from "../../../../components/SoftButton";
import FormControl from "@mui/material/FormControl";

const validationSchema = yup.object({
    firstName: yup.string().required('Primer Nombre es requerido'),
    lastName: yup.string().required('Segundo Nombre es requerido'),
    emailAddress: yup
        .string()
        .email('Introduzca un email válido')
        .required('Email es requerido'),
    gender: yup.string().required('Seleccione un género'), // Add gender validation
    typeDocumentId: yup.string().required('Seleccione un tipo de documento'),
    birthDate: yup.date().required('Fecha de nacimiento es requerida'), // Step 2: Add birthDate validation
    documentId: yup.string().required('Documento de identidad es requerido'),
    branchId: yup.string().required('Seleccione una sucursal'),
    comments: yup.string().required('Comentario es requerido'),
    groupRoleId: yup.string().optional(),
    groupCompanyId: yup.string().optional(),
});

function MuiAlert(props: { severity: string, children: ReactNode }) {
    return null;
}

export const AddClientForm = () => {
    const [groupMember, setGroupMember] = useState([]);

    function sleep(delay = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }


    const [openBranches, setOpenBranches] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = openBranches && options.length === 0;


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


    const [openGroupRole, setOpenGroupRole] = React.useState(false);
    const [optionsGroupRole, setOptionsGroupRole] = React.useState([]);
    const loadingGroupRole = openGroupRole && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loadingGroupRole) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {

                createAPIEndpoint(ENDPOINTS.groupRole).fetchGroupRoles(
                    {}
                ).then(
                    res => {
                        console.log(res.data);
                        setOptionsGroupRole(res.data);

                    }).then(
                    err => console.log(err)
                )
            }
        })();

        return () => {
            active = false;
        };
    }, [loadingGroupRole]);

    React.useEffect(() => {
        if (!openGroupRole) {
            setOptionsGroupRole([]);
        }
    }, [openGroupRole]);


    const [openGroupCompany, setOpenGroupCompany] = React.useState(false);
    const [optionsGroupCompany, setOptionsGroupCompany] = React.useState([]);
    const loadingGroup = openGroupCompany && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loadingGroup) {
            return undefined;
        }

        (async () => {
            await sleep(1e3); // For demo purposes.

            if (active) {

                createAPIEndpoint(ENDPOINTS.groupCompany).fetchGroupCompany(
                    {}
                ).then(
                    res => {
                        console.log(res.data);
                        setOptionsGroupCompany(res.data);

                    }).then(
                    err => console.log(err)
                )
            }
        })();

        return () => {
            active = false;
        };
    }, [loadingGroup]);

    React.useEffect(() => {
        if (!openGroupCompany) {
            setOptionsGroupCompany([]);
        }
    }, [openGroupCompany]);


    const {context, setContext} = useStateContext();
    const {
        control,
        handleSubmit,
        formState: {errors, isValid},
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            emailAddress: '',
            gender: '', // Add default value for gender
            typeDocumentId: '',
            birthDate: new Date(),
            documentId: '',
            branchId: '',
            comments: '',
        },
    });

    const onSubmit = (data) => {

        const updatedcontext = {
            addresses: Array.isArray(context.addresses) ? [...context.addresses] : [],
            phones: Array.isArray(context.phones) ? [...context.phones] : [],
            ...data,
            groupMember: includeGroupCompany
                ? [
                    {
                        groupRoleId: data.groupRoleId,
                        groupCompanyId: data.groupCompanyId,
                    },
                    ...groupMember,
                ]
                : groupMember,
        };


        createAPIEndpoint(ENDPOINTS.customers,
        ).postClient(updatedcontext, {}).then(

        ).catch(
            err => console.log(err)
        )
    };

    function handleSearch(e) {
        e.preventDefault();
    }

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 400,
        bgcolor: "#f7f8f9", // Color
        boxShadow: 24,
        borderRadius: '3px',
        p: 4
    };

    const handleDeletePhone = (index) => {
        const updatedPhones = context.phones.filter((_, i) => i !== index);
        const updatedContext = {
            ...context,
            phones: updatedPhones,
        };
        setContext(updatedContext);
    };
    const handleDeleteAddress = (index) => {
        const updatedAddresses = context.addresses.filter((_, i) => i !== index);
        const updatedContext = {
            ...context,
            addresses: updatedAddresses,
        };
        setContext(updatedContext);
    };
    const documentTypes = [
        {label: 'Cédula', value: 'CID'},
        {label: 'Pasaporte', value: 'PASS'},
        {label: 'RUC', value: 'RUC'},
    ];

    const genderTypes = [
        {label: 'Masculino', value: 'M'},
        {label: 'Femenino', value: 'F'},
    ];

    const getPhoneTypeLabel = (value) => {
        switch (value) {
            case 'HOM':
                return 'Casa';
            case 'MOB':
                return 'Móvil';
            case 'OFF':
                return 'Oficina';
            case 'OTH':
                return 'Otro';
            default:
                return 'Desconocido';
        }
    };

    const getAddressTypeLabel = (value) => {
        switch (value) {
            case 'HOM':
                return 'Casa';
            case 'OFF':
                return 'Oficina';
            case 'OTH':
                return 'Otro';
        }
    };
    const [openAddress, setOpenAddress] = React.useState(false);
    const handleOpenAddress = () => setOpenAddress(true);

    const {secondary} = colors;
    const {borderWidth} = borders;

    const handleCloseAddress = () => setOpenAddress(false);

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    const handleDeleteConfirmation = () => {
        // Perform the delete operation here using the deleteIndex
        const updatedAddresses = context.addresses.filter((_, i) => i !== deleteIndex);
        const updatedContext = {
            ...context,
            addresses: updatedAddresses,
        };
        setContext(updatedContext);
        setDeleteIndex(null); // Clear deleteIndex after successful deletion
    };

    // Function to add a new phone number field

    const [includeGroupCompany, setIncludeGroupCompany] = useState(false);

    return (
        <Stack gap={5}>
            <Stack spacing={2} alignItems="center">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container rowSpacing={3} columnSpacing={{xs: 1, sm: 2, md: 3}}>
                        <Grid item xs={12}>
                            {/* First Name */}
                            <Controller
                                name="firstName"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        fullWidth
                                        type="text"
                                        id="firstName"
                                        label="Nombre"
                                        {...field}
                                        error={Boolean(errors.firstName)}
                                        helperText={errors.firstName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {/* Last Name */}
                            <Controller
                                name="lastName"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        fullWidth
                                        type="text"
                                        id="lastName"
                                        label="Apellido"
                                        {...field}
                                        error={Boolean(errors.lastName)}
                                        helperText={errors.lastName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {/* Email Address */}
                            <Controller
                                name="emailAddress"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        fullWidth
                                        type="text"
                                        id="emailAddress"
                                        label="Email"
                                        {...field}
                                        error={Boolean(errors.emailAddress)}
                                        helperText={errors.emailAddress?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Email/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {/* Gender */}

                            <Controller
                                name="gender"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        select // tell TextField to render select
                                        label="Género"
                                        error={Boolean(errors.gender)}
                                        helperText={errors.gender?.message}
                                    >
                                        {genderTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            {/* Type of Document */}
                            <Controller
                                name="typeDocumentId"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        select // tell TextField to render select
                                        label="Tipo de Documento"
                                        error={Boolean(errors.typeDocumentId)}
                                        helperText={errors.typeDocumentId?.message}
                                    >
                                        {documentTypes.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            {/* Document ID */}
                            <Controller
                                name="documentId"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        fullWidth
                                        type="text"
                                        id="documentId"
                                        label="Documento de Identidad"
                                        {...field}
                                        error={Boolean(errors.documentId)}
                                        helperText={errors.documentId?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AccountCircle/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            {/* Birth Date */}
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    control={control}
                                    name="birthDate"
                                    render={({field}) => (
                                        <DatePicker
                                            slotProps={{textField: {fullWidth: true}}}
                                            onChange={(date) => field.onChange(date)}
                                            selected={field.value}
                                            label="Fecha de Nacimiento"
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={6}>
                            {/* Comments */}
                            <Controller
                                name="comments"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        fullWidth
                                        type="text"
                                        id="comments"
                                        label="Comentario"
                                        {...field}
                                        error={Boolean(errors.comments)}
                                        helperText={errors.comments?.message}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ChatBubble/>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {/* Branch */}
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
                                            value === undefined || value === "" || option.uniqueKey === value.uniqueKey
                                        }
                                        isOptionEqualToValue={(option, value) => option.uniqueKey === value?.uniqueKey}
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
                                                                <CircularProgress color="inherit"
                                                                                  size={20}/> : null}
                                                            {params.InputProps.endAdornment}
                                                        </React.Fragment>
                                                    ),
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Business/>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={Boolean(errors.branchId)}
                                                helperText={errors.branchId?.message}
                                            />
                                        )}
                                        onChange={(_event, data) => field.onChange(data?.uniqueKey ?? '')}
                                    />
                                )}
                            />
                        </Grid>


                        <Grid item xs={6}>
                            <Button onClick={handleOpen} variant="contained" startIcon={<AddCircleOutline/>}>
                                Añadir
                                Teléfono {/* Assuming "Teléfono" is the correct spelling for "phone" in your language */}
                            </Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{backdropFilter: "blur(5px)"}}
                            >
                                <Box sx={style}>
                                    <PhoneCreationForm/>
                                </Box>
                            </Modal>
                        </Grid>

                        <Grid item xs={6}>
                            {context.phones && (
                                <>
                                    {context.phones.map((phone, index) => (
                                        <Box gridColumn="span 12">
                                            <div>
                                                <Accordion key={index}>
                                                    <AccordionSummary
                                                        expandIcon={<ExpandMore/>}
                                                        aria-controls="panel1a-content"
                                                        id="panel1a-header"
                                                    >
                                                        <Box sx={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(12, 1fr)',
                                                            gap: 4
                                                        }}>
                                                            <Box gridColumn="span 12"
                                                                 sx={{position: 'relative'}}>
                                                                <SoftTypography align="center"
                                                                                sx={{fontWeight: 'bold'}}>
                                                                    Teléfono {index + 1}
                                                                </SoftTypography>

                                                            </Box>
                                                        </Box>
                                                    </AccordionSummary>
                                                    <AccordionDetails>
                                                        <Box>
                                                            <SoftTypography>{`Número: ${phone.phoneNumber}`}</SoftTypography>
                                                            <SoftTypography>{`Tipo: ${getPhoneTypeLabel(phone.phoneType)}`}</SoftTypography>
                                                            <SoftTypography>{`¿Predeterminado?: ${phone.isDefault ? 'Sí' : 'No'}`}</SoftTypography>
                                                        </Box>
                                                        <Box sx={{position: 'absolute', bottom: 0, right: 0}}>

                                                            <ButtonGroup variant="outlined"
                                                                         aria-label="outlined button group">

                                                                <IconButton aria-label="delete"
                                                                            onClick={() => handleDeletePhone(index)}>
                                                                    <DeleteIcon fontSize="small"/>
                                                                </IconButton>

                                                                <IconButton aria-label="edit">
                                                                    <EditIcon fontSize="small"/>
                                                                </IconButton>
                                                            </ButtonGroup>
                                                        </Box>
                                                        {/* Optionally add more details here */}
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        </Box>
                                    ))}
                                </>
                            )}
                        </Grid>


                        <Grid item xs={6}>
                            <div>

                                <Button onClick={handleOpenAddress} variant="contained" startIcon={<AddCircleOutline/>}>
                                    Añadir Dirección
                                </Button>
                                <Modal
                                    open={openAddress}
                                    onClose={handleCloseAddress}
                                    aria-labelledby="modal-modal-title"
                                    aria-describedby="modal-modal-description"
                                    style={{backdropFilter: "blur(5px)"}}
                                >
                                    <Box sx={style}>
                                        <AddressCreationForm/>
                                    </Box>
                                </Modal>
                            </div>
                        </Grid>

                        {context.addresses && (
                            <>
                                {context.addresses.map((address, index) => (

                                    <Box gridColumn="span 12">
                                        <div>
                                            <Accordion key={index}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMore/>}
                                                    aria-controls="panel1a-content"
                                                    id="panel1a-header"
                                                >
                                                    <Box sx={{
                                                        display: 'grid',
                                                        gridTemplateColumns: 'repeat(12, 1fr)',
                                                        gap: 4
                                                    }}>
                                                        <Box gridColumn="span 12"
                                                             sx={{position: 'relative'}}>
                                                            <SoftTypography align="center"
                                                                            sx={{fontWeight: 'bold'}}>
                                                                Dirección {index + 1}
                                                            </SoftTypography>
                                                        </Box>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{position: 'relative'}}>
                                                    <Box>
                                                        <SoftTypography>{`Tipo de Dirección: ${getAddressTypeLabel(address.typeAddress)}`}</SoftTypography>
                                                        <SoftTypography>{`Dirección Línea 1: ${address.line1}`}</SoftTypography>
                                                        <SoftTypography>{`Dirección Línea 2: ${address.line2}`}</SoftTypography>
                                                        <SoftTypography>{`Latitud: ${address.latitude}`}</SoftTypography>
                                                        <SoftTypography>{`Longitud: ${address.longitude}`}</SoftTypography>
                                                        <SoftTypography>{`¿Predeterminada?: ${address.isDefault ? 'Sí' : 'No'}`}</SoftTypography>
                                                    </Box>
                                                    <Box sx={{position: 'absolute', bottom: 0, right: 0}}>
                                                        <IconButton aria-label="delete"
                                                                    onClick={() => handleDeleteAddress(index)}>
                                                            <DeleteIcon fontSize="small"/>
                                                        </IconButton>
                                                    </Box>
                                                    {/* Optionally add more details here */}
                                                </AccordionDetails>
                                            </Accordion>
                                        </div>
                                    </Box>
                                ))}


                            </>
                        )}

                        <FormControl component="fieldset">
                            <FormGroup>
                                {/* Checkbox for including groupCompanyId in form submission */}

                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={includeGroupCompany}
                                            onChange={(e) => setIncludeGroupCompany(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label="Es representante de una empresa?"
                                />
                                {/* Input field for groupCompanyId */}
                                {includeGroupCompany && (
                                    <>

                                        <Controller
                                            name="groupCompanyId"
                                            control={control}
                                            render={({field}) => (
                                                <Autocomplete
                                                    id="groupCompanyId"
                                                    open={openGroupCompany}
                                                    onOpen={() => {
                                                        setOpenGroupCompany(true);
                                                    }}
                                                    onClose={() => {
                                                        setOpenGroupCompany(false);
                                                    }}
                                                    getOptionSelected={(option, value) =>
                                                        value === undefined || value === "" || option.id === value.id
                                                    }
                                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                    getOptionLabel={(option) => option.groupName || ''}
                                                    fullWidth
                                                    options={optionsGroupCompany}
                                                    loading={loadingGroup}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Seleccione una Empresa"
                                                            fullWidth
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (
                                                                    <React.Fragment>
                                                                        {loadingGroup ?
                                                                            <CircularProgress color="inherit"
                                                                                              size={20}/> : null}
                                                                        {params.InputProps.endAdornment}
                                                                    </React.Fragment>
                                                                ),
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Business/>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            error={Boolean(errors.groupcompanyId)}
                                                            helperText={errors.groupcompanyId?.message}
                                                        />
                                                    )}
                                                    onChange={(_event, data) => field.onChange(data?.id ?? '')}
                                                />
                                            )}
                                        />

                                        <Controller
                                            name="groupRoleId"
                                            control={control}
                                            render={({field}) => (
                                                <Autocomplete
                                                    id="groupRoleId"
                                                    open={openGroupRole}
                                                    onOpen={() => {
                                                        setOpenGroupRole(true);
                                                    }}
                                                    onClose={() => {
                                                        setOpenGroupRole(false);
                                                    }}
                                                    getOptionSelected={(option, value) =>
                                                        value === undefined || value === "" || option.id === value.id
                                                    }
                                                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                                                    getOptionLabel={(option) => option.groupRoleName || ''}
                                                    fullWidth
                                                    options={optionsGroupRole}
                                                    loading={loadingGroupRole}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Seleccione su Rol "
                                                            fullWidth
                                                            InputProps={{
                                                                ...params.InputProps,
                                                                endAdornment: (
                                                                    <React.Fragment>
                                                                        {loadingGroupRole ?
                                                                            <CircularProgress color="inherit"
                                                                                              size={20}/> : null}
                                                                        {params.InputProps.endAdornment}
                                                                    </React.Fragment>
                                                                ),
                                                                startAdornment: (
                                                                    <InputAdornment position="start">
                                                                        <Business/>
                                                                    </InputAdornment>
                                                                ),
                                                            }}
                                                            error={Boolean(errors.groupRoleId)}
                                                            helperText={errors.groupRoleId?.message}
                                                        />
                                                    )}
                                                    onChange={(_event, data) => field.onChange(data?.id ?? '')}
                                                />
                                            )}
                                        />


                                    </>
                                )

                                }
                            </FormGroup>
                        </FormControl>


                        <Grid item xs={12}>
                            <SoftButton

                                type={"submit"}
                                variant={"gradient"}
                                color={"primary"}
                                disabled={!isValid} // Disable the button if the form is not valid
                            >

                                Crear Cliente
                            </SoftButton>
                        </Grid>
                    </Grid>
                </form>

            </Stack>
        </Stack>
    );
};
