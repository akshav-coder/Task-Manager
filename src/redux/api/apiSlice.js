import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5001/api/" }), // Base URL of the backend
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: () => "tasks", // GET /api/tasks
    }),
    createTask: builder.mutation({
      query: (newTask) => ({
        url: "tasks",
        method: "POST",
        body: newTask,
      }),
    }),
    loginUser: builder.mutation({
      query: (userCredentials) => ({
        url: "users/login",
        method: "POST",
        body: userCredentials,
      }),
    }),
  }),
});

// Export hooks for components
export const { useGetTasksQuery, useCreateTaskMutation, useLoginUserMutation } =
  apiSlice;
