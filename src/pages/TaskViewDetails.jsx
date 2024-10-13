import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

const TaskViewDetails = ({ open, onClose, taskDetails }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Task Details</DialogTitle>
      <DialogContent dividers>
        {taskDetails ? (
          <>
            <Typography variant="body1">
              <strong>Title:</strong> {taskDetails.title}
            </Typography>
            <Typography variant="body1">
              <strong>Description:</strong> {taskDetails.description}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {taskDetails.status}
            </Typography>
            <Typography variant="body1">
              <strong>Status:</strong> {taskDetails.createdAt}
            </Typography>
            {/* Add more details as needed */}
          </>
        ) : (
          <Typography variant="body1">No task details available</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskViewDetails;
