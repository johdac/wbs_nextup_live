import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Landing } from "./components/pages/Landing";
import EventList from "./components/layout/Events";
import { Register } from "./components/pages/Register";
import { Login } from "./components/pages/Login";

export const router = createBrowserRouter([
  {
    element: <AppLayout></AppLayout>,
    children: [
      {
        path: "/",
        element: <Landing></Landing>,
      },
      {
        path: "/events",
        element: <EventList></EventList>,
      },
    ],
  },
  {
    element: <Register></Register>,
    path: "/register",
  },
  {
    element: <Login></Login>,
    path: "/login",
  },
]);
