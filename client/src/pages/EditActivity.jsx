import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import http from '../http'
import { Box, Typography, TextField, Button } from '@mui/material'
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { useFormik } from 'formik'

const isFutureOrToday = (value) => {
    const currentDate = new Date();
    const inputDate = new Date(value);
    return inputDate >= currentDate;
}

const isValidMonth = (value) => {
    const month = parseInt(value.split('-')[1], 10);
    return month >= 1 && month <= 12;
};

function EditActivity() {
    const { id } = useParams();
    const navigate = useNavigate();

    const validationSchema = yup.object({
        Program: yup.string().trim().min(10, 'The program that you will attend must be at least 10 characters.').required('Program Name is required'),
        Name: yup.string().trim().required('Please enter your name'),
        Contact_Number: yup.number().integer().test('len', 'Contact number must have exactly 8 digits', val => val.toString().length === 8).required("Contact Number is required"),
        Date: yup.string().trim().matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid format. Please enter in yyyy-mm-dd format.')
            .test('is-future-or-today', 'Date must be today or in the future', isFutureOrToday)
            .test('is-valid-month', 'Invalid month. Please ensure month is between 01 and 12.', isValidMonth)
            .required("Please enter the date")
    })

    const [initialValues, setInitialValues] = useState({
        Program: "",
        Name: "",
        Contact_Number: "",
        Date: ""
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                const response = await http.get(`/volunteering/${id}`);
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
                await http.put(`/volunteering/${id}`, values);
                alert('Program updated successfully!');
            } catch (error) {
                console.error('Error updating program:', error);
                alert('Failed to edit program. Please try again.');
            }
        }
    });

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteProgram = async () => {
        try {
            await http.delete(`volunteering/${id}`);
            console.log('Program deleted');
            navigate('/volunteering');
        } catch(error) {
            console.error('Error deleting program:', error);
        }
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Activity
            </Typography>
            {
                !loading && (
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
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Withdraw
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Withdraw from Program
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to withdraw from this program?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='inherit' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant='contained' color='error' onClick={deleteProgram}>
                        Withdraw
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EditActivity