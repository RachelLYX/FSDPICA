import React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../http';

function AddProgram() {
    const validationSchema = yup.object({
        Program: yup.string().trim().min(10, 'Program must be at least 10 characters').required('Title is required'),
        Venue: yup.string().trim().min(10, 'Venue must be at least 10 characters').required('Venue is required'),
        Time: yup.string().trim().matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, 'Invalid time format. Use hh:mm:ss (24-hour)').required('Time is required'),
        Date: yup.string().trim().required('Date is required'),
        Lunch: yup.string().trim().matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, 'Invalid timing for lunch. Use hh:mm:ss (24-hour)').required('Lunch timing is required')
    });

    const formik = useFormik({
        initialValues: {
            Program: "",
            Venue: "",
            Time: "",
            Date: "",
            Lunch: ""
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await http.post('/programs', values); // Example HTTP POST request
                alert('Program added successfully!');
            } catch (error) {
                console.error('Error adding program:', error);
                alert('Failed to add program. Please try again.');
            }
        }
    });

    return (
        <Box>
            <Typography variant='h5' sx={{ my: 2 }}>
                Add Program
            </Typography>
            <Box component='form' onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    margin='dense'
                    autoComplete='off'
                    label='Program'
                    name='Program'
                    value={formik.values.Program}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Program && Boolean(formik.errors.Program)}
                    helperText={formik.touched.Program && formik.errors.Program}
                />
                <TextField
                    fullWidth
                    margin='dense'
                    autoComplete='off'
                    label='Venue'
                    name='Venue'
                    value={formik.values.Venue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Venue && Boolean(formik.errors.Venue)}
                    helperText={formik.touched.Venue && formik.errors.Venue}
                />
                <TextField
                    fullWidth
                    margin='dense'
                    autoComplete='off'
                    label='Time'
                    name='Time'
                    value={formik.values.Time}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Time && Boolean(formik.errors.Time)}
                    helperText={formik.touched.Time && formik.errors.Time}
                />
                <TextField
                    fullWidth
                    margin='dense'
                    autoComplete='off'
                    type='date'
                    label='Date'
                    name='Date'
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={formik.values.Date}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Date && Boolean(formik.errors.Date)}
                    helperText={formik.touched.Date && formik.errors.Date}
                />
                <TextField
                    fullWidth
                    margin='dense'
                    autoComplete='off'
                    label='Lunch'
                    name='Lunch'
                    value={formik.values.Lunch}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.Lunch && Boolean(formik.errors.Lunch)}
                    helperText={formik.touched.Lunch && formik.errors.Lunch}
                />

                <Box sx={{ mt: 2 }}>
                    <Button variant='contained' type='submit'>
                        Add
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default AddProgram;
