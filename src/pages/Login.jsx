import React, { useEffect } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  useGoogleAuthMutation,
  useLoginUserMutation,
} from "../redux/api/apiSlice";
import { login } from "../redux/reducers/authSlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  GoogleLogin,
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google"; // Import Google Login

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation(); // RTK Query mutation hook
  const [googleAuth] = useGoogleAuthMutation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const onFinish = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      email: data.get("email"),
      password: data.get("password"),
    };

    try {
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

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google credential response:", credentialResponse); // Add this for debugging
    try {
      const { credential } = credentialResponse;

      // Dispatch the registration API call with Google token
      const response = await googleAuth({
        token: credential, // Pass the Google token
      }).unwrap();

      dispatch(login(response));

      console.log("Google sign-in success:", response); // Add this for debugging

      setTimeout(() => {
        navigate("/"); // Force navigation after a short delay
      }, 100);
    } catch (err) {
      console.error("Failed to sign up with Google:", err);
    }
  };

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
            disabled={isLoading}
          >
            {isLoading ? "Logging In..." : "Log In"}
          </Button>
        </Box>
        <Typography component="p" variant="subtitle1" sx={{ mt: 2 }}>
          Or sign in with
        </Typography>
        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log("Google sign-in error");
          }}
          text={"signin_with"}
        />
      </Box>
    </Container>
  );
};

export default Login;
