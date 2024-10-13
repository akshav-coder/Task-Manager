import React from "react";
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from "@mui/material";
import { Draggable } from "react-beautiful-dnd";
import { useDeleteTaskMutation } from "../redux/api/apiSlice";

const TaskCard = ({ task, index, onEdit, onView }) => {
  const [deleteTask] = useDeleteTaskMutation();

  const handleDelete = async () => {
    try {
      // Use the updateTask API mutation to update the task status
      await deleteTask(task?._id).unwrap();
    } catch (error) {
      console.error("Failed to update task delete", error);
    }
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            marginTop: "10px",
            color: "black",
            backgroundColor: "#D2E6FA",
          }}
        >
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {task.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
              {task.description}
            </Typography>
            <Typography
              gutterBottom
              sx={{
                color: "text.secondary",
                fontSize: 14,
              }}
            >
              Created at: {task.createdAt}
            </Typography>
          </CardContent>
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="error"
              size="small"
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Button variant="contained" size="small" onClick={onEdit}>
              Edit
            </Button>
            <Button variant="contained" size="small" onClick={onView}>
              View Details
            </Button>
          </CardActions>
        </Card>
      )}
    </Draggable>
  );
};

export default TaskCard;
