import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Icon from '@mui/material/Icon';
import Divider from '@mui/material/Divider';
import IconButton from "@mui/material/IconButton";
import {Add, MenuSharp} from "@mui/icons-material";

export default function Country() {
    return (
       <Box>
           <Grid container spacing={6} sx={{ justifyContent: 'center' }}>
               <Grid item xs={12} sm={6} md={4}>
                   <Paper elevation={3}>
                       <IconButton aria-label="add">
                           <Add/>
                       </IconButton>
                   </Paper>
               </Grid>
               <Grid item xs={12} sm={6} md={4}>
                   <Paper elevation={3}>
                       <IconButton aria-label="view">
                           <MenuSharp/>
                       </IconButton>

                   </Paper>
               </Grid>
               <Grid item xs={12} sm={6} md={4}>
                   <Paper elevation={3}>
                       <IconButton aria-label="edit">
                            <Icon>edit</Icon>
                       </IconButton>
                   </Paper>
               </Grid>
           </Grid>
           <Divider/>
       </Box>
    );
}

