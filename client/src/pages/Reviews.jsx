import React, { useState, useEffect } from 'react'
import { Box, Typography, TextField, Button, IconButton } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

const initialReviews = [
    {
        comment: "I love saving the earth!",
        author: "Brandi, 17, IT Student at Nanyang Polytechnic"
    },
    {
        comment: "I should encourage my friends to join this activity",
        author: "Darren, 18, Engineering Student at Nanyang Polytechnic"
    },
    {
        comment: "This gives me a lesson about sustainability",
        author: "Dustin, 18, Engineering Student at Nanyang Polytechnic"
    }
];

const validationSchema = yup.object({
    author: yup.string().trim().required('Author is required'),
    comment: yup.string().trim().required('Comment is required')
})

const Reviews = () => {
    const [reviews, setReviews] = useState(initialReviews);
    const [editingIndex, setEditingIndex] = useState(null);

    const formik = useFormik({
        initialValues: {
            author: '',
            comment: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values, { resetForm }) => {
            const newReview = { comment: values.comment, author: values.author };

            if (editingIndex !== null) {
                const updatedReviews = reviews.map((review, index) => 
                    index === editingIndex ? newReview : review
                );
                setReviews(updatedReviews);
                setEditingIndex(null);
            } else {
                setReviews([...reviews, newReview]);
            }
            resetForm();
        }
    });

    const handleDelete = (index) => {
        const updatedReviews = reviews.filter((_, i) => i !== index);
        setReviews(updatedReviews);
    };

    const handleEdit = (index) => {
        const reviewToEdit = reviews[index];
        formik.setValues(reviewToEdit);
        setEditingIndex(index);
    };

    return (
        <Box sx={{ padding: '20px', maxWidth: '600px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'}}>
            <Typography variant="h6" align="center" sx={{ mb: 3 }}>
                Reviews from Students
            </Typography>
            {reviews.map((review, index) => (
                <Box key={index} sx={{ mb: 2, position: 'relative' }}>
                    <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                        {review.comment}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {review.author}
                    </Typography>
                    <IconButton onClick={() => handleDelete(index)} sx={{ position: 'absolute', top: 0, right: 0}}>
                        <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(index)} sx={{ position: 'absolute', top: 0, right: 40}}>
                        <EditIcon />
                    </IconButton>
                </Box>
            ))}
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                <TextField
                    fullWidth
                    label="Author"
                    name="author"
                    value={formik.values.author}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    error={formik.touched.author && Boolean(formik.errors.author)}
                    helperText={formik.touched.author && formik.errors.author}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Comment"
                    name="comment"
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    variant="outlined"
                    error={formik.touched.comment && Boolean(formik.errors.comment)}
                    helperText={formik.touched.comment && formik.errors.comment}
                    sx={{ mb: 2 }}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    {editingIndex !== null ? 'Update' : 'Send'}
                </Button>
            </Box>
        </Box>
    )
}

  

export default Reviews