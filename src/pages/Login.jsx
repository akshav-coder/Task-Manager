import React, { useEffect } from "react";
import { Box, Button, TextField, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup"; // For form validation
import {
  useGoogleAuthMutation,
  useLoginUserMutation,
} from "../redux/api/apiSlice";
import { login } from "../redux/reducers/authSlice";
import { showSnackbar } from "../redux/reducers/snackbarSlice";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google"; // Import Google

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginUser, { isLoading }] = useLoginUserMutation(); // RTK Query mutation hook
  const [googleAuth] = useGoogleAuthMutation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to TaskBoard after login
    }
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const user = await loginUser(values).unwrap();
        dispatch(login(user));
        dispatch(
          showSnackbar({
            message: "Logged in successfully",
            severity: "success",
          })
        );
        navigate("/"); // Redirect on successful login
      } catch (error) {
        console.error("Login failed:", error);

        if (error.data?.data) {
          // Set field errors from API response
          const { email, password } = error.data.data;
          if (email) {
            setFieldError("email", email);
          }
          if (password) {
            setFieldError("password", password);
          }
        } else {
          alert("Failed to login: " + (error.data?.message || "Unknown error"));
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    console.log("Google credential response:", credentialResponse);
    try {
      const { credential } = credentialResponse;

      // Dispatch the registration API call with Google token
      const response = await googleAuth({
        token: credential,
      }).unwrap();

      dispatch(login(response));
      dispatch(
        showSnackbar({ message: "Logged in successfully", severity: "success" })
      );
      console.log("Google sign-in success:", response);

      setTimeout(() => {
        navigate("/"); // Force navigation after a short delay
      }, 100);
    } catch (err) {
      console.error("Failed to sign up with Google:", err);
      dispatch(
        showSnackbar({
          message: err?.data?.message || "Failed to sign up with Google",
          severity: "error",
        })
      );
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
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            placeholder="Email Address"
            name="email"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            placeholder="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading || formik.isSubmitting}
          >
            {isLoading || formik.isSubmitting ? "Logging In..." : "Log In"}
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
