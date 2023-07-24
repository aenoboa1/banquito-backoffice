import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from '@mui/material/Divider';
import Button from "@mui/material/Button";
import MapIcon from '@mui/icons-material/Map';
import FestivalIcon from '@mui/icons-material/Festival';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import { LocationSearching } from "@mui/icons-material";
import { InputLabel } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { createAPIEndpoint } from 'api';
import { ENDPOINTS } from 'api';
import axios from 'axios';

export default function GeoLocation() {
    const [showProvinces, setShowProvinces] = useState(false);
    const [showCantons, setShowCantons] = useState(false);
    const [showParishes, setShowParishes] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [searchedCountry, setSearchedCountry] = useState('');
    const [countries, setCountries] = useState([]);
    const [levelCode, setLevelCode] = useState(0);

    useEffect(() => {
        getAllCountries();
    }, []);

    const toggleShowTable = () => {
        setShowTable(!showTable);
    }

    
    const toggleShowProvinces = () => {
        setShowProvinces(!showProvinces);
        setLevelCode(1);
    }

    const toggleShowCantons = () => {
        setShowCantons(!showCantons);
        toggleShowTable();
        setLevelCode(2);
    }

    const toggleShowParishes = () => {
        setShowParishes(!showParishes);
        toggleShowTable();
        setLevelCode(3);
    }

    const handleCountryChange = (event) => {
        setSearchedCountry(event.target.value);
    };

    const handleClickSearchCountry = () => {
        console.log('searchedCountry: ', searchedCountry);
        getProvinces(searchedCountry);

    }

    const getAllCountries = () => {
        createAPIEndpoint(ENDPOINTS.country,
        ).fetchAll({

        }).then(response =>
            response.status.valueOf() === 200 ? setCountries(response.data) : setCountries(null),
        ).catch(
            err => console.log(err)
        )
    }

    const getProvinces = (country) => {
        axios.get('https://banquito-ws-gestion-admin-production.up.railway.app/api/v1/geo-structure/locations/'+country, { params: { levelCode: levelCode } })
            .then(response => {
                if (response.status.valueOf() === 200) {
                    setProvinces(response.data.locations);
                    toggleShowTable();
                }
            })
            .catch(err => console.log(err))
    }



    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {
            field: 'name',
            headerName: 'NOMBRE',
            width: 130,
            editable: true,
        },
        {
            field: 'areaPhoneCode',
            headerName: 'CÓDIGO DE ÁREA',
            width: 250,
            editable: true,
        },
        {
            field: 'zipCode',
            headerName: 'CÓDIGO POSTAL',
            width: 300,
            editable: true,
        }
    ];

    const rows = provinces.map((province) => (
        {
            id: province.id,
            name: province.name,
            areaPhoneCode: province.areaPhoneCode,
            zipCode: province.zipCode
        }
    ));

    const ProvincesTable = () => {
        return (
            <Box sx={{ height: 350, width: '100%' }}>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 4,
                            },
                        },
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                            }
                        }
                    }}
                    pageSizeOptions={[4]}
                    disableRowSelectionOnClick                    
                    sx={{ m: 4 }}
                 />
            </Box>

        )
    }




    const SearchInput = () => {
        return (
            <Box>
                <Grid container sx={{ justifyContent: 'center' }}>
                    <FormControl sx={{ p: 1, m: 1, display: 'block' }} >
                        <InputLabel id="demo-simple-select-label">País</InputLabel>
                        <Select sx={{ width: 200 }}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={searchedCountry}
                            label="País"
                            onChange={handleCountryChange}
                        >
                            {countries.map((country) => (
                                <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>
                            ))}

                        </Select>
                    </FormControl>
                    <IconButton>
                        <LocationSearching size="small" onClick={handleClickSearchCountry} fontSize="inherit" />
                    </IconButton>
                </Grid>
                <Divider></Divider>
                {showTable && <ProvincesTable />}

            </Box>

        )
    }


    return (
        <Box>
            <Grid container spacing={6} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center' }}>
                        <Button aria-label="add" size="large" onClick={toggleShowProvinces} startIcon={<MapIcon />}>
                            Provincias
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center' }}>
                        <Button aria-label="view" size="large" onClick={toggleShowCantons} startIcon={<FestivalIcon />}>
                            Cantones
                        </Button>

                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center' }}>
                        <Button aria-label="edit" size="large" onClick={toggleShowParishes} startIcon={<LocationCityIcon />}>
                            Parroquias
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Divider/>
            {showProvinces || showCantons || showParishes ? (<SearchInput />): (<></>)}
        </Box>
    )
}