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
import { addTask, updateTask } from "../redux/reducers/taskSlice";
import TaskCard from "../components/TaskCard";
import TaskDialog from "../components/TaskDialog";

const columns = [
  { id: 1, title: "To Do" },
  { id: 2, title: "In Progress" },
  { id: 3, title: "Done" },
];

const TaskBoard = () => {
  const tasks = useSelector((state) => state.tasks.tasks);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(""); // Sorting state
  const [openDialog, setOpenDialog] = useState(false); // For Add/Edit dialog
  const [dialogTask, setDialogTask] = useState(null); // Task to edit

  // Drag and Drop functionality
  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const taskBeingMoved = tasks.find(
      (task) => task.id === parseInt(result.draggableId)
    );

    if (taskBeingMoved) {
      dispatch(
        updateTask({
          id: taskBeingMoved.id,
          updates: { status: parseInt(destination.droppableId) },
        })
      );
    }
  };

  // Handle Task Search
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Sorting
  const sortedTasks = filteredTasks.sort((a, b) => {
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

      {/* Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Grid2 container spacing={3}>
          {columns.map((column) => (
            <Grid2 key={column.id} size={4}>
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
                  <Droppable droppableId={String(column.id)}>
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
                          .filter((task) => task.status === column.id)
                          .map((task, index) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              index={index}
                              onEdit={() => handleEditTask(task)} // Pass edit function
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
