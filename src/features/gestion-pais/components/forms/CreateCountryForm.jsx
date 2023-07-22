import React from 'react';
import {Formik, ErrorMessage, Form} from 'formik';
import FormControl from '@mui/material/FormControl';
import Box from "@mui/material/Box";
import FormHelperText from '@mui/material/FormHelperText';
import Button from "@mui/material/Button";
import OutlinedInput from '@mui/material/OutlinedInput';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {InputLabel} from "@mui/material";

export default function CreateCountryForm() {

    return (
        <Formik
            initialValues={{
                code: '',
                name: '',
                phoneCode: ''
        }}
            validate={(values) => {
                let errors = {};
                if (!values.code) {
                    errors.code = 'Código de país requerido!';
                }
                else if (values.code.length !== 3) {
                    errors.code = 'El código debe tener 3 caracteres!';
                }
                else if (!/^[A-Za-z]+$/.test(values.code)) {
                    errors.code = 'El código debe contener solo letras!';
                }
                if (!values.name) {
                    errors.name = 'Nombre de país requerido!';
                }
                else if (!/^[A-Za-z]+$/.test(values.name)) {
                    errors.name = 'El nombre debe contener solo letras!';
                }
                if (!values.phoneCode) {
                    errors.phoneCode = 'Código de teléfono requerido!';
                }
                else if (values.phoneCode.length !== 4) {
                    errors.phoneCode = 'El código debe tener 4 caracteres!';
                }
                return errors;
            }}
            onSubmit={(values, {resetForm}) => {
                resetForm();
                console.log(values);
            }}
        >
            {({ errors,values,handleChange   }) => (
               <Box >
                   <Grid container  sx={{justifyContent: 'center'}}>
                       <Card sx={{width: '50%'}}>
                           <CardContent>
                               <Typography variant="h5" component="div">
                                   Nuevo País
                               </Typography>
                               <Box >
                                   <Form sx={{width: '50%'}}>
                                       <FormControl sx={{ p: 1, m: 1, display:'block'}}>
                                           <InputLabel htmlFor="code" size="small">Código</InputLabel>
                                           <OutlinedInput fullWidth id="code" name="code" onChange={handleChange} value={values.code} inputLabelProps={{shrink:true}} />
                                           <ErrorMessage name="code" component={() => (<FormHelperText id="component-error-text">{errors.code}</FormHelperText>)}/>
                                       </FormControl>
                                       <FormControl sx={{ p: 1, m: 1, display:'block' }}>
                                           <InputLabel htmlFor="name" size="small">Nombre</InputLabel>
                                           <OutlinedInput fullWidth id="name" name="name" onChange={handleChange} value={values.name} inputLabelProps={{shrink:true}} />
                                           <ErrorMessage name="name" component={() => (<FormHelperText id="component-error-text">{errors.name}</FormHelperText>)}/>
                                       </FormControl>
                                       <FormControl sx={{ p: 1, m: 1, display:'block' }}>
                                           <InputLabel htmlFor="phoneCode" size="small">Código de teléfono</InputLabel>
                                           <OutlinedInput fullWidth id="phoneCode" name="phoneCode" onChange={handleChange} value={values.phoneCode} inputLabelProps={{shrink:true}}/>
                                           <ErrorMessage name="phoneCode" component={() => (<FormHelperText id="component-error-text">{errors.phoneCode}</FormHelperText>)}/>
                                       </FormControl>
                                       <Button type="submit" variant="filled">Crear</Button>
                                   </Form>
                               </Box>
                           </CardContent>
                       </Card>
                   </Grid>

               </Box>
                )}
        </Formik>
    )
}