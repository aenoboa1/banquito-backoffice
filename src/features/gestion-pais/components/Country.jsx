import React, {useState} from 'react';
import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from '@mui/material/Divider';
import {AccountTree, AddLocationSharp, TravelExplore} from "@mui/icons-material";
import Button from "@mui/material/Button";
import CreateCountryForm from "./forms/CreateCountryForm";


export default function Country() {
    const [showCountryForm, setShowCountryForm] = useState(false);
    const toggleCountryFormVisibility = () => {
        setShowCountryForm(true);
    }
    return (
        <Box>
            <Grid container spacing={6} sx={{justifyContent: 'center'}}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center'}}>
                        <Button aria-label="add" size="large" onClick={toggleCountryFormVisibility}  startIcon={<AddLocationSharp/>}>
                            Crear
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center'}}>
                        <Button aria-label="view" size="large" startIcon={<TravelExplore/>}>
                            Buscar
                        </Button>

                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center'}}>
                        <Button aria-label="edit" size="large" startIcon={<AccountTree/>}>
                            Estructura Geográfica
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Divider/>
            {showCountryForm && <CreateCountryForm/>}
        </Box>
    );
}

