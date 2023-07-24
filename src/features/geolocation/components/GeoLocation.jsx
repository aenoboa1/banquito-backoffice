import Box from '@mui/material/Box';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Divider from '@mui/material/Divider';
import Button from "@mui/material/Button";
import MapIcon from '@mui/icons-material/Map';
import FestivalIcon from '@mui/icons-material/Festival';
import LocationCityIcon from '@mui/icons-material/LocationCity';

export default function GeoLocation() {
    return(
        <Box>
            <Grid container spacing={6} sx={{ justifyContent: 'center' }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center' }}>
                        <Button aria-label="add" size="large"  startIcon={<MapIcon />}>
                            Provincias
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center' }}>
                        <Button aria-label="view" size="large" startIcon={<FestivalIcon />}>
                            Cantones
                        </Button>

                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper elevation={3} sx={{ mx: 'auto', width: 200, p: 1, m: 1, textAlign: 'center' }}>
                        <Button aria-label="edit" size="large"  startIcon={<LocationCityIcon />}>
                            Parroquias
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Divider />
        </Box>
    )
}