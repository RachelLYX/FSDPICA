import React from 'react'
import { Box, Typography, TextField, Button } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import http from '../http'


const isFutureOrToday = (value) => {
    const currentDate = new Date();
    const inputDate = new Date(value);
    return inputDate >= currentDate;
}

const isValidMonth = (value) => {
    const month = parseInt(value.split('-')[1], 10);
    return month >= 1 && month <= 12;
};

function AddActivity() {
  const validationSchema = yup.object({
    Program: yup.string().trim().required('Program Name is required'),
    Name: yup.string().trim().required('Please enter your name'),
    Contact_Number: yup.number().integer().test('len', 'Contact number must have exactly 8 digits', val => val.toString().length === 8).required("Contact Number is required"),
    Date: yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Please enter in yyyy-mm-dd format.')
    .test('is-future-or-today', 'Date must be today or in the future', isFutureOrToday)
    .test('is-valid-month', 'Invalid month. Please ensure month is between 01 and 12.', isValidMonth)
    .required("Please enter the date")
  })
  const formik = useFormik({
    initialValues: {
        Program: "",
        Name: "",
        Contact_Number: "",
        Date: ""
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
        try {
            await http.post('/volunteering', values);
            alert('You have successfully signed up for the program.');
        } catch(error) {
            console.error('Error signing up for program:', error);
            alert('Failed to sign up for program, please try again.');
        }
    }
    
  });

  return (
    <Box>
        <Typography variant="h5" sx={{ my: 2 }}>
            Sign up for an Activity
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit}>
            <TextField
                fullWidth margin="dense" autoComplete='off'
                label="Program"
                name="Program"
                value={formik.values.Program}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Program && Boolean(formik.errors.Program)}
                helperText={formik.touched.Program && formik.errors.Program}
            />
            <TextField
                fullWidth margin="dense" autoComplete='off'
                label="Name"
                name="Name"
                value={formik.values.Name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Name && Boolean(formik.errors.Name)}
                helperText={formik.touched.Name && formik.errors.Name}
            />
            <TextField
                fullWidth margin="dense" autoComplete='off'
                label="Contact_Number"
                name="Contact_Number"
                type='text'
                value={formik.values.Contact_Number}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Contact_Number && Boolean(formik.errors.Contact_Number)}
                helperText={formik.touched.Contact_Number && formik.errors.Contact_Number}
            />
            <TextField
                fullWidth margin="dense" autoComplete='off'
                type='date'
                label="Date"
                name="Date"
                InputLabelProps={{
                    shrink: true,
                }}
                value={formik.values.Date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.Date && Boolean(formik.errors.Date)}
                helperText={formik.touched.Date && formik.errors.Date}
            />

            <Box sx={{ mt: 2 }}>
                <Button variant='contained' type='submit'>
                    Sign up
                </Button>
            </Box>
        </Box>
    </Box>
  )
}

export default AddActivity