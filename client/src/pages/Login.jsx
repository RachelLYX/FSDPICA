// client/src/pages/Login.jsx

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "../http";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Link } from "@mui/material";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await axios.post("/auth/login", values);
        localStorage.setItem("token", response.data.token);
        navigate("/profile");
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.response.data.error);
      }
    },
  });

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Log In
      </Typography>
      <form onSubmit={formik.handleSubmit} style={{ marginTop: "20px" }}>
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
        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          style={{ marginTop: "20px" }}
        >
          Log In
        </Button>
      </form>
      <Link
        href="/forgot-password"
        variant="body2"
        style={{ marginTop: "10px", display: "block" }}
      >
        Forgot password?
      </Link>
    </Container>
  );
};

export default Login;
