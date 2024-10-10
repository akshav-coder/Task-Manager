import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tasks: [
    {
      id: 1,
      title: "Task 1",
      status: "To Do",
      description: "description are here 1",
      createdAt: new Date().toISOString().split("T")[0],
    },
    {
      id: 2,
      title: "Task 2",
      status: "In Progress",
      description: "description are here 2",
      createdAt: new Date().toISOString().split("T")[0],
    },
    {
      id: 3,
      title: "Task 3",
      status: "Done",
      description: "description are here 3",
      createdAt: new Date().toISOString().split("T")[0],
    },
  ],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const task = state.tasks.find((task) => task.id === id);
      if (task) {
        Object.assign(task, updates);
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
    },
  },
});

export const { addTask, updateTask, deleteTask } = taskSlice.actions;

export default taskSlice.reducer;
