import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Landing } from "./components/pages/Landing";
import EventList from "./components/layout/Events";
import { Register } from "./components/pages/Register";
import { Login } from "./components/pages/Login";
import { EventDetails } from "./components/pages/EventDetails";
import { ArtistDetails } from "./components/pages/ArtistDetails";
import { CreateEvent } from "./components/pages/CreateEvent";

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
      {
        path: "/event/:id",
        element: <EventDetails></EventDetails>,
      },
      {
        path: "/artist/:id",
        element: <ArtistDetails></ArtistDetails>,
      },
      {
        path: "/create",
        element: <CreateEvent></CreateEvent>,
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
