import React, { useEffect } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../redux/api/apiSlice";
import { login } from "../redux/reducers/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation(); // RTK Query mutation hook
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const onFinish = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
      // Call the login mutation and unwrap to handle success/error
      const user = await loginUser(values).unwrap();
      console.log("Login successful:", user);
      dispatch(login(user));
      navigate("/"); // Redirect on successful login
    } catch (error) {
      console.error("Login failed:", error);
      alert("Failed to login: " + error.data?.message || "Unknown error");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to TaskBoard after login
    }
  }, [isAuthenticated, navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box component="form" onSubmit={onFinish} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading} // Disable button if the request is loading
          >
            {isLoading ? "Logging In..." : "Log In"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
