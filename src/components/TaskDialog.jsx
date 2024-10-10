import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
} from "../redux/api/apiSlice";

const TaskDialog = ({ open, onClose, initialTask, columns }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
  });

  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation(); // Mutation for creating tasks
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation(); // Mutation for updating tasks

  // Populate dialog fields when editing a task
  useEffect(() => {
    if (initialTask) {
      setTaskData({
        title: initialTask.title,
        description: initialTask.description,
      });
    } else {
      setTaskData({
        title: "",
        description: "",
      });
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (initialTask) {
        // Update the existing task
        await updateTask({ id: initialTask._id, ...taskData }).unwrap();
      } else {
        // Create a new task
        await createTask(taskData).unwrap();
      }
      onClose(); // Close the dialog after saving
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initialTask ? "Edit Task" : "Add New Task"}</DialogTitle>
      <DialogContent>
        <TextField
          label="Task Title"
          name="title"
          fullWidth
          margin="dense"
          value={taskData.title}
          onChange={handleChange}
        />
        <TextField
          label="Task Description"
          name="description"
          fullWidth
          margin="dense"
          multiline
          rows={3}
          value={taskData.description}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color="primary"
          disabled={isCreating || isUpdating} // Disable button while saving
        >
          {initialTask ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
