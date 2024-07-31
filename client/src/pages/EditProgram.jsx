import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../http';
import { Box, Typography, TextField, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';

function EditProgram() {
    const { id } = useParams();

    const validationSchema = yup.object({
        Program: yup.string().trim().min(10, 'Program must be at least 10 characters').required('Title is required'),
        Venue: yup.string().trim().min(10, 'Venue must be at least 10 characters').required('Venue is required'),
        Time: yup.string().trim().matches(/^(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)$/, 'Invalid time format. Use hh:mm:ss (24-hour)').required('Time is required'),
        Date: yup.string().trim().required('Date is required'),
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

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteProgram = () => {
        http.delete(`/programs/${id}`)
            .then((res) => {
                console.log(res.data);
                navigate('/programs');
            })
            .catch(error => {
                console.error('Error deleting program:', error);
                alert('Failed to delete program. Please try again.');
            });
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
                            <Button variant="contained" sx={{ ml: 2 }} color='error' onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Program
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this program?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant='contained' color='inherit' onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant='contained' color='error' onClick={deleteProgram}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default EditProgram;



