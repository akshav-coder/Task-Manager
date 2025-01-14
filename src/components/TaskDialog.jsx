import React, { useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../redux/api/apiSlice";
import { useDispatch } from "react-redux";
import { showSnackbar } from "../redux/reducers/snackbarSlice";

const TaskDialog = ({ open, onClose, initialTask, columns }) => {
  const dispatch = useDispatch();

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Title is required"),
      description: Yup.string().trim().required("Description is required"),
    }),
    onSubmit: async (values) => {
      try {
        if (initialTask) {
          await updateTask({ id: initialTask._id, ...values }).unwrap();
        } else {
          await createTask(values).unwrap();
          formik.resetForm();
        }
        dispatch(
          showSnackbar({
            message: "Task Upadated",
            severity: "success",
          })
        );
        onClose();
      } catch (error) {
        console.error("Error saving task:", error);
        dispatch(
          showSnackbar({
            message: "Task Upadate Failed",
            severity: "error",
          })
        );
      }
    },
  });

  useEffect(() => {
    if (initialTask) {
      formik.setValues({
        title: initialTask.title,
        description: initialTask.description,
      });
    } else {
      formik.resetForm();
    }
  }, [initialTask]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialTask ? "Edit Task" : "Add New Task"}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            label="Task Title"
            name="title"
            fullWidth
            margin="dense"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && Boolean(formik.errors.title)}
            helperText={formik.touched.title && formik.errors.title}
          />
          <TextField
            label="Task Description"
            name="description"
            fullWidth
            margin="dense"
            multiline
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isCreating || isUpdating}
          >
            {initialTask ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaskDialog;
