import React, { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import { addTask } from "../redux/reducers/taskSlice";
import TaskCard from "../components/TaskCard";
import TaskDialog from "../components/TaskDialog";
import { useGetTasksQuery, useUpdateTaskMutation } from "../redux/api/apiSlice";
import TaskViewDetails from "./TaskViewDetails";
import { showSnackbar } from "../redux/reducers/snackbarSlice";

const columns = [
  { status: "To Do", title: "To Do" },
  { status: "In Progress", title: "In Progress" },
  { status: "Done", title: "Done" },
];

const TaskBoard = () => {
  const { data: fetchedTasks, error, isLoading, refetch } = useGetTasksQuery();
  const [updateTask] = useUpdateTaskMutation();
  const dispatch = useDispatch();

  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogTask, setDialogTask] = useState(null);
  const [taskView, setTaskView] = useState(false);

  useEffect(() => {
    if (fetchedTasks) {
      setTasks(fetchedTasks);
    }
  }, [fetchedTasks]);

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
      // Optimistically update the task in the local state
      const updatedTasks = tasks.map((task) =>
        task._id === taskBeingMoved._id
          ? { ...task, status: destination.droppableId }
          : task
      );
      setTasks(updatedTasks);

      try {
        await updateTask({
          id: taskBeingMoved._id,
          status: destination.droppableId,
        }).unwrap();

        dispatch(
          showSnackbar({
            message: "Task moved",
            severity: "success",
          })
        );
      } catch (error) {
        console.error("Failed to update task status", error);

        dispatch(
          showSnackbar({
            message: "Task move failed",
            severity: "error",
          })
        );

        // Revert the task back to its original state if the API call fails
        const revertedTasks = tasks.map((task) =>
          task._id === taskBeingMoved._id
            ? { ...task, status: source.droppableId }
            : task
        );
        setTasks(revertedTasks);
      }
    }
  };

  const filteredTasks = tasks?.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasks = filteredTasks?.sort((a, b) => {
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortBy === "createdAt") {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  const handleOpenDialog = () => {
    setDialogTask(null);
    setOpenDialog(true);
  };

  const handleEditTask = (task) => {
    setDialogTask(task);
    setOpenDialog(true);
  };

  const handleView = (task) => {
    setTaskView(true);
    setDialogTask(task);
  };

  const handleSaveTask = (taskData) => {
    if (dialogTask) {
      dispatch(
        updateTask({
          id: dialogTask.id,
          updates: taskData,
        })
      );
    } else {
      const newTaskWithId = {
        ...taskData,
        id: tasks.length + 1,
        createdAt: new Date().toISOString(),
      };
      dispatch(addTask(newTaskWithId));
    }
    setOpenDialog(false);
  };

  useEffect(() => {
    refetch();
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenDialog}
        sx={{ mb: 2 }}
      >
        Add Task
      </Button>
      <Box
        display="flex"
        justifyContent={"space-between"}
        flexDirection={{ xs: "column", md: "row" }}
        alignItems={"flex-end"}
        mb={2}
      >
        <TextField
          label="Search Tasks"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: { xs: 2, md: 0 }, width: { xs: "100%", md: "auto" } }}
        />

        <Box display="flex" flexDirection="column" ml={{ md: 2 }}>
          <InputLabel id="filter-label">Sort By</InputLabel>
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              labelId="filter-label"
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="createdAt">Recent</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <TaskDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleSaveTask}
        initialTask={dialogTask}
        columns={columns}
      />

      <TaskViewDetails
        open={taskView}
        onClose={() => setTaskView(false)}
        taskDetails={dialogTask}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <Grid2 container spacing={3}>
          {columns.map((column) => (
            <Grid2 key={column.status} size={{ xs: 12, md: 4, sm: 6 }}>
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
                          height: { xs: "400px", md: "620px" },
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
