Task Manager Frontend
This repository contains the frontend code for the Task Management application. It is built using React, Vite.js, and Redux Toolkit. The frontend interacts with the backend to provide a user-friendly interface for managing tasks.

Features
 - Task CRUD Operations: Create, read, update, and delete tasks.
 - Drag-and-Drop: Reorganize tasks across different boards.
 - User Authentication: Google OAuth login with JWT token storage.
 - Responsive UI: Built with Material-UI for a modern, responsive design.


Prerequisites
Ensure you have the following installed:

- Node.js (v14+)
- Backend API running on http://localhost:5000

Environment Variables
You need to configure the following environment variable in a .env file at the root of the frontend project:
VITE_API_URL=http://localhost:5000


Installation and Setup
- Clone the repository: git clone https://github.com/akshav-coder/Task-Manager-frontend.git
- Navigate to the frontend directory: cd Task-Manager-frontend
- Install dependencies: npm install
- Start the development server: npm run dev
- Open the application in your browser at http://localhost:5173.

Folder Structure
.
├── public
├── src
│   ├── components   # Contains all reusable components (TaskDialog, TaskBoard, etc.)
│   ├── hooks        # Custom hooks for handling API calls and logic
│   ├── redux        # Redux slices and store setup
│   ├── pages        # App pages (Login, Dashboard, etc.)
│   ├── styles       # MUI and custom styles
├── .env             # Environment variables file
├── package.json     # Project configuration and dependencies
├── vite.config.js   # Vite.js configuration
└── README.md








