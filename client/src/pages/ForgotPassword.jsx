// client/src/pages/ForgotPassword.jsx

import React, { useState } from "react";
import axios from "../http";
import { TextField, Button, Container, Typography } from "@mui/material";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);

  const handleEmailSubmit = async () => {
    try {
      await axios.post("/auth/forgot-password", { email });
      setStep(2);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      alert("Failed to send OTP: " + error.response.data.error);
    }
  };

  const handleOtpSubmit = async () => {
    try {
      await axios.post("/auth/reset-password", { email, otp, newPassword });
      alert("Password reset successful");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
    } catch (error) {
      console.error("Failed to reset password:", error);
      alert("Failed to reset password: " + error.response.data.error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Forgot Password
      </Typography>
      {step === 1 ? (
        <div>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleEmailSubmit}
          >
            Send OTP
          </Button>
        </div>
      ) : (
        <div>
          <TextField
            fullWidth
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleOtpSubmit}>
            Reset Password
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ForgotPassword;
