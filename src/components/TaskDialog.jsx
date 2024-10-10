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

const TaskDialog = ({ open, onClose, onSave, initialTask, columns }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: 1,
  });

  // Populate dialog fields when editing a task
  useEffect(() => {
    if (initialTask) {
      setTaskData({
        title: initialTask.title,
        description: initialTask.description,
        status: initialTask.status,
      });
    } else {
      // Clear form data when adding a new task
      setTaskData({
        title: "",
        description: "",
        status: 1,
      });
    }
  }, [initialTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(taskData);
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
        <FormControl fullWidth margin="dense">
          <InputLabel>Status</InputLabel>
          <Select
            name="status"
            value={taskData.status}
            onChange={handleChange}
            label="Status"
          >
            {columns.map((column) => (
              <MenuItem key={column.id} value={column.id}>
                {column.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {initialTask ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDialog;
