import React, {useState} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import {InputAdornment, InputLabel} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import IconButton from "@mui/material/IconButton";
import {LocationSearching} from "@mui/icons-material";
import {createAPIEndpoint, ENDPOINTS} from "../../../api";

export default function ViewCountry() {
    const [searchedCountry, setSearchedCountry] = useState('');
    const handleClickSearchCountry = () => {
        console.log('searchedCountry: ', searchedCountry);
        submit(searchedCountry);

    }

    const submit = (searchedCountry) => {
        createAPIEndpoint(ENDPOINTS.country,
        ).fetchById(searchedCountry,{

        }).then( response =>
            console.log(response.data)

        ).catch(
            err => console.log(err)
        )
    };
    return (
        <Box>
            <Grid container spacing={2} sx={{justifyContent:'center'}}>
                <FormControl sx={{ m: 1, p:1, width:'50%' }} variant="outlined">
                    <InputLabel htmlFor="name">País</InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="name"
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickSearchCountry}
                                    edge="end"
                                >
                                    <LocationSearching/>
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Buscar País"
                        value={searchedCountry}
                        onChange={(e) => setSearchedCountry(e.target.value)}
                    />
                </FormControl>
            </Grid>
        </Box>
    )
}