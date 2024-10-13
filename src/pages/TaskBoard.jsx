import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
} from "@mui/material";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { addTask } from "../redux/reducers/taskSlice"; // Still need addTask for local state
import TaskCard from "../components/TaskCard";
import TaskDialog from "../components/TaskDialog";
import { useGetTasksQuery, useUpdateTaskMutation } from "../redux/api/apiSlice"; // Import mutation hook
import { Flag } from "@mui/icons-material";
import TaskViewDetails from "./TaskViewDetails";

const columns = [
  { status: "To Do", title: "To Do" },
  { status: "In Progress", title: "In Progress" },
  { status: "Done", title: "Done" },
];

const TaskBoard = () => {
  const { data: tasks, error, isLoading } = useGetTasksQuery();
  const [updateTask] = useUpdateTaskMutation(); // Use mutation hook for updateTask
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(""); // Sorting state
  const [openDialog, setOpenDialog] = useState(false); // For Add/Edit dialog
  const [dialogTask, setDialogTask] = useState(null); // Task to edit
  const [taskView, setTaskView] = useState(false);

  // Drag and Drop functionality
  const onDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskBeingMoved = tasks.find(
      (task) => task._id === result.draggableId
    );

    if (taskBeingMoved) {
      try {
        // Use the updateTask API mutation to update the task status
        await updateTask({
          id: taskBeingMoved._id,
          status: destination.droppableId, // Update with new status
        }).unwrap();
      } catch (error) {
        console.error("Failed to update task status", error);
      }
    }
  };

  // Handle Task Search
  const filteredTasks = tasks?.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Sorting
  const sortedTasks = filteredTasks?.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "createdAt") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  // Open Add Task Dialog
  const handleOpenDialog = () => {
    setDialogTask(null); // Reset to null for adding new task
    setOpenDialog(true);
  };

  // Open Edit Task Dialog
  const handleEditTask = (task) => {
    setDialogTask(task); // Set the task to edit
    setOpenDialog(true);
  };

  const handleView = (task) => {
    setTaskView(true);
    setDialogTask(task);
  };

  // Handle Save Task (Add or Update)
  const handleSaveTask = (taskData) => {
    if (dialogTask) {
      // Edit existing task
      dispatch(
        updateTask({
          id: dialogTask.id,
          updates: taskData,
        })
      );
    } else {
      // Add new task
      const newTaskWithId = {
        ...taskData,
        id: tasks.length + 1,
        createdAt: new Date().toISOString().split("T")[0],
      };
      dispatch(addTask(newTaskWithId));
    }
    setOpenDialog(false);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box>
      {/* Search, Sort, and Add Task Controls */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        sx={{ mb: 2 }}
      >
        Add Task
      </Button>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField
          label="Search Tasks"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <Select
            size="small"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="title">Title</MenuItem>
            <MenuItem value="createdAt">Recent</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Task Dialog for Add/Edit */}
      <TaskDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveTask}
        initialTask={dialogTask} // null for add, task for edit
        columns={columns}
      />

      <TaskViewDetails
        open={taskView}
        onClose={() => setTaskView(false)}
        taskDetails={dialogTask}
      />

      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid2 container spacing={3}>
          {columns.map((column) => (
            <Grid2 key={column.status} size={4}>
              <Card>
                <CardContent>
                  <Typography
                    sx={{
                      color: "white",
                      backgroundColor: "#5696F5",
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      fontSize: "18px",
                      mb: 2,
                    }}
                  >
                    {column.title}
                  </Typography>
                  <Droppable droppableId={String(column.status)}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          flexGrow: 1,
                          overflowY: "auto",
                          marginTop: "10px",
                          height: "620px",
                        }}
                      >
                        {sortedTasks
                          .filter((task) => task.status === column.status)
                          .map((task, index) => (
                            <TaskCard
                              key={task._id}
                              task={task}
                              index={index}
                              onEdit={() => handleEditTask(task)}
                              onView={() => handleView(task)}
                            />
                          ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      </DragDropContext>
    </Box>
  );
};

export default TaskBoard;
