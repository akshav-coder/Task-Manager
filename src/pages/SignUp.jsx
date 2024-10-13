import React, { useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  useGoogleAuthMutation,
  useRegisterUserMutation,
} from "../redux/api/apiSlice";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"; // Import Google Login
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/reducers/snackbarSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading, error }] = useRegisterUserMutation();
  const [googleAuth] = useGoogleAuthMutation();

  // Validation schema using Yup
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        await registerUser({
          email: values.email,
          password: values.password,
          name: `${values.firstName} ${values.lastName}`,
        }).unwrap();
        dispatch(
          showSnackbar({
            message: "Sign up successful",
            severity: "success",
          })
        );
        navigate("/login");
      } catch (err) {
        console.error("Failed to sign up:", err);

        if (err?.data?.data?.email) {
          setFieldError("email", err.data.data.email);
        } else {
          dispatch(
            showSnackbar({
              message: err?.data?.message || "Failed to sign up",
              severity: "error",
            })
          );
        }
      }
    },
  });

  // Handle Google Sign-In response
  const handleGoogleSuccess = async (credentialResponse) => {
    // This response contains the Google JWT token
    try {
      const { credential } = credentialResponse;

      // Dispatch the registration API call with Google token
      await googleAuth({
        token: credential, // Pass the Google token
      }).unwrap();

      // Navigate to login on success
      navigate("/login");
    } catch (error) {
      if (error?.data?.data) {
        dispatch(
          showSnackbar({
            message: error.data?.data?.email || "Failed to sign up",
            severity: "error",
          })
        );
      }
      console.error("Failed to sign up with Google:", error);
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
          Sign Up
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
            id="firstName"
            label="First Name"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="family-name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
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
            label="Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword && formik.errors.confirmPassword
            }
          />
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error.data?.message || "Failed to register"}
            </Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            Sign Up
          </Button>
        </Box>
        <Typography component="p" variant="subtitle1" sx={{ mt: 2 }}>
          Or sign up with
        </Typography>
        {/* Google Login Button */}
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => {
            console.log("Google sign-in error");
          }}
          text={"signup_with"}
        />
      </Box>
    </Container>
  );
};

export default SignUp;
