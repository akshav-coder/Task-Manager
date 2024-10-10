import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { Container, GlobalStyles } from "@mui/material";
import TaskBoard from "./pages/TaskBoard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AppHeader from "./components/AppHeader";
import ProtectedRoute from "./components/ProtectedRoute";

const AppLayout = () => (
  <>
    <GlobalStyles styles={{ body: { margin: 0, padding: 0 } }} />
    <AppHeader />
    <Container sx={{ mt: 4 }}>
      <Outlet />
    </Container>
  </>
);

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: (
          <ProtectedRoute>
            <TaskBoard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
