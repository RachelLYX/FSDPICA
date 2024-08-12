// client/src/pages/Register.jsx

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "../http";
import { TextField, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const validationSchema = yup.object({
  username: yup.string().required("Username is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
  birth_date: yup.date().required("Birth date is required"),
  school: yup.string(),
  bio: yup.string(),
  // avatar_url: yup.mixed(), //.required("Avatar is required") Errors with avatar, leave nullable
});

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      birth_date: "",
      school: "",
      bio: "",
      avatar_url: null,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        for (const key in values) {
          console.log(key, values[key]);
          formData.append(key, values[key]);
        }
        const response = await axios.post("http://localhost:3001/auth/register", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        alert("You have successfully signed up!");
        navigate("/login"); // Redirect to login page
      } catch (error) {
        console.error("Registration error:", error.response.data);
        alert("Registration failed: " + error.response.data.error);
      }
    },
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={formik.handleSubmit} style={{ marginTop: "20px" }}>
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Birth Date"
          name="birth_date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formik.values.birth_date}
          onChange={formik.handleChange}
          error={formik.touched.birth_date && Boolean(formik.errors.birth_date)}
          helperText={formik.touched.birth_date && formik.errors.birth_date}
          margin="normal"
        />
        <TextField
          fullWidth
          label="School"
          name="school"
          value={formik.values.school}
          onChange={formik.handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Bio"
          name="bio"
          value={formik.values.bio}
          onChange={formik.handleChange}
          multiline
          rows={4}
          margin="normal"
        />
        <Button
          variant="contained"
          component="label"
          style={{ marginTop: "10px", marginBottom: "20px" }}
        >
          Upload Avatar
          <input
            type="file"
            name="avatar_url"
            accept="image/*"
            hidden
            onChange={(event) =>
              formik.setFieldValue("avatar_url", event.currentTarget.files[0])
            }
          />
        </Button>
        <Button color="primary" variant="contained" fullWidth type="submit">
          Sign Up
        </Button>
      </form>
    </Container>
  );
};

export default Register;
