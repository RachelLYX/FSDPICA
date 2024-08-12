// import React from 'react';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { TextField, Button, Box } from '@mui/material';
// import http from '../http';


// const ReplyForm = ({ parentId }) => {
//     const formik = useFormik({
//       initialValues: {
//         content: '',
//       },
//       validationSchema: Yup.object({
//         content: Yup.string().required('Content is required'),
//       }),
//       onSubmit: async (values, { resetForm }) => {
//         try {
//           // Ensure that the username is correctly set, with a fallback to 'Dave Smith'
//           const username = localStorage.getItem('username') || 'Dave Smith';
          
//           // Assign the username to the values object
//           const payload = {
//             ...values,
//             username,  // This adds the username to the form data
//           };
  
//           await http.post(`/api/forums/reply/${parentId}`, payload);
//           resetForm();
//           window.location.reload(); // Reload to show the new reply
//         } catch (error) {
//           console.error('Error replying to post:', error);
//         }
//       },
//     });
  

//   return (
//     <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
//       <TextField
//         fullWidth
//         id="content"
//         name="content"
//         label="Reply Content"
//         multiline
//         rows={4}
//         value={formik.values.content}
//         onChange={formik.handleChange}
//         error={formik.touched.content && Boolean(formik.errors.content)}
//         helperText={formik.touched.content && formik.errors.content}
//         margin="normal"
//       />
//       <Button color="primary" variant="contained" fullWidth type="submit">
//         Submit Reply
//       </Button>
//     </Box>
//   );
// };

// export default ReplyForm;


import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, Box } from '@mui/material';
import http from '../http';

const ReplyForm = ({ parentId, onReply }) => {
  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema: Yup.object({
      content: Yup.string().required('Content is required'),
    }),
    onSubmit: async (values, { resetForm, setStatus }) => {
        try {
          const username = localStorage.getItem('username') || 'Dave Smith';
          
          const payload = {
            ...values,
            username,
          };
  
          console.log('Sending reply:', payload);
  
          const response = await http.post(`/api/forums/reply/${parentId}`, payload);
          
          console.log('Full server response:', response.data);
  
          if (response.data && response.data.replyThread) {
            onReply(response.data.replyThread);
            resetForm();

            // window.location.reload();
            history.go(0);
          } else {
            setStatus('Invalid response from server');
            console.error('Unexpected server response:', response.data);
          }
        } catch (error) {
          console.error('Error replying to post:', error);
          setStatus(error.response?.data?.message || 'An error occurred while submitting the reply');
        }
      },
    });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        id="content"
        name="content"
        label="Reply Content"
        multiline
        rows={4}
        value={formik.values.content}
        onChange={formik.handleChange}
        error={formik.touched.content && Boolean(formik.errors.content)}
        helperText={formik.touched.content && formik.errors.content}
        margin="normal"
      />
      <Button color="primary" variant="contained" fullWidth type="submit">
        Submit Reply
      </Button>
    </Box>
  );
};

export default ReplyForm;