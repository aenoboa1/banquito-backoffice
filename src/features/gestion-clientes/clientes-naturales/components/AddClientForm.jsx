import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const validationSchema = yup.object({
    email: yup
        .string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: yup
        .string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required'),

});

// TODO : FIX STYLES !!!

export const AddClientForm = () => {
    const formik = useFormik({
        initialValues: {
            firstName: '',
            lastName: '',
            gender: '',
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4}>
                    <Box gridColumn="span 12">
                        <TextField
                            fullWidth
                            type="text"
                            id="email"
                            name="email"
                            label="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Box>
                    <Box gridColumn="span 12">
                        <TextField
                            fullWidth
                            id="textonly"
                            name="textonly"
                            label="textonly"
                            type="text"
                            value={formik.values.textonly}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.textonly && Boolean(formik.errors.textonly)}
                            helperText={formik.touched.textonly && formik.errors.textonly}
                        />
                    </Box>
                    <Box gridColumn="span 12">
                        <TextField
                            fullWidth
                            id="textonly"
                            name="textonly"
                            label="textonly"
                            type="text"
                            value={formik.values.textonly}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.textonly && Boolean(formik.errors.textonly)}
                            helperText={formik.touched.textonly && formik.errors.textonly}
                        />
                    </Box>

                    <Box gridColumn="span 12">
                        <Button color="primary" variant="contained" fullWidth type="submit">
                            Crear
                        </Button>
                    </Box>


                </Box>


            </form>
        </div>
    );
};
