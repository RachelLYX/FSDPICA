import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button } from "@mui/material";

const HomePage = () => {
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
        backgroundColor: "#f5f5f5",
        padding: "20px",
      }}
    >
      <Typography variant="h3" gutterBottom>
        Your One-Stop Shop for Campus Sustainability
      </Typography>
      <Typography variant="h5" gutterBottom>
        Creating change makers, collaborators, and informed stewards.
      </Typography>
      <div style={{ marginTop: "20px" }}>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ marginRight: "10px" }}
          >
            Log In
          </Button>
        </Link>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <Button variant="outlined" color="primary">
            Sign Up
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default HomePage;
