import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import http from '../http';

const CreateForum = () => {
  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      content: Yup.string().required('Content is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        values.username = localStorage.getItem('username') || 'Dave Smith';
        await http.post('/api/forums/create', values);
        resetForm();
        window.location.href = '/';
      } catch (error) {
        console.error('Error creating forum:', error);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        id="title"
        name="title"
        label="Forum Title"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        margin="normal"
      />
      <TextField
        fullWidth
        id="content"
        name="content"
        label="Forum Content"
        multiline
        rows={4}
        value={formik.values.content}
        onChange={formik.handleChange}
        error={formik.touched.content && Boolean(formik.errors.content)}
        helperText={formik.touched.content && formik.errors.content}
        margin="normal"
      />
      <Button color="primary" variant="contained" fullWidth type="submit">
        Create Forum
      </Button>
    </Box>
  );
};

export default CreateForum;
