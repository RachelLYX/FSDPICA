import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

const isFutureOrToday = (value) => {
    const currentDate = new Date();
    const inputDate = new Date(value);
    return inputDate >= currentDate;
}

const isValidMonth = (value) => {
    const month = parseInt(value.split('-')[1], 10);
    return month >= 1 && month <= 12;
};

function EditProgram() {
    const { id } = useParams();
    const navigate = useNavigate();

    const validationSchema = yup.object({
        Program: yup.string().trim().min(10, 'Program must be at least 10 characters').required('Title is required'),
        Venue: yup.string().trim().min(10, 'Venue must be at least 10 characters').required('Venue is required'),
        Time: yup.string().trim().matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, 'Invalid time format. Use hh:mm:ss (24-hour)').required('Time is required'),
        Date: yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Please enter in yyyy-mm-dd format.')
        .test('is-future-or-today', 'Date must be today or in the future', isFutureOrToday)
        .test('is-valid-month', 'Invalid month. Please ensure month is between 01 and 12.', isValidMonth)
        .required("Please enter the date"),
        Lunch: yup.string().trim().matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, 'Invalid timing for lunch. Use hh:mm:ss').required('Lunch timing is required')
    });

    const [initialValues, setInitialValues] = useState({
        Program: "",
        Venue: "",
        Time: "",
        Date: "",
        Lunch: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const response = await http.get(`/programs/${id}`);
                setInitialValues(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching program:', error);
            }
        };

        if (id) {
            fetchProgram();
        }
    }, [id]);

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log(values);
            try {
                await http.put(`/programs/${id}`, values);
                alert('Program updated successfully!');
                //navigate('/programs');
            } catch (error) {
                console.error('Error updating program:', error);
                alert('Failed to edit program. Please try again.');
            }
        }
    });

    const handleCancel = () => {
        navigate('/programs');
    }



    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Program
            </Typography>
            {
                !loading && (
                    <Box component='form' onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Program"
                            name="Program"
                            value={formik.values.Program}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Program && Boolean(formik.errors.Program)}
                            helperText={formik.touched.Program && formik.errors.Program}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Venue"
                            name="Venue"
                            value={formik.values.Venue}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Venue && Boolean(formik.errors.Venue)}
                            helperText={formik.touched.Venue && formik.errors.Venue}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Time"
                            name="Time"
                            value={formik.values.Time}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Time && Boolean(formik.errors.Time)}
                            helperText={formik.touched.Time && formik.errors.Time}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            type='date'
                            label="Date"
                            name="Date"
                            InputLabelProps={{ shrink: true }}
                            value={formik.values.Date}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Date && Boolean(formik.errors.Date)}
                            helperText={formik.touched.Date && formik.errors.Date}
                        />
                        <TextField
                            fullWidth
                            margin="dense"
                            autoComplete="off"
                            label="Lunch"
                            name="Lunch"
                            value={formik.values.Lunch}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.Lunch && Boolean(formik.errors.Lunch)}
                            helperText={formik.touched.Lunch && formik.errors.Lunch}
                        />
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color='error' onClick={handleCancel}>
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )
            }
            </Box>
    )
}

export default EditProgram;



