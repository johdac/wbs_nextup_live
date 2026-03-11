import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Landing } from "./components/pages/Landing";
import EventList from "./components/layout/Events";
import { Register } from "./components/pages/Register";
import { Login } from "./components/pages/Login";
import { EventDetails } from "./components/pages/EventDetails";
import { ArtistDetails } from "./components/pages/ArtistDetails";
import { CreateEvent } from "./components/pages/CreateEvent";
import { ManagedLocations } from "./components/pages/ManagedLocations";
import { ManagedEvents } from "./components/pages/ManagedEvents";
import { ManagedArtists } from "./components/pages/ManagedArtists";
import { VenueDetails } from "./components/pages/LocationDetails";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserSetting } from "./components/pages/UserSetting";
import { EditEvent } from "./components/pages/EditEvent";
import { EventDetailsEdit } from "./components/pages/EventDetailsEdit";
import { VenueDetailsEdit } from "./components/pages/LocationDetailsEdit";
import { ArtistDetailsEdit } from "./components/pages/ArtistDetailsEdit";

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
        path: "/venue/:id",
        element: <VenueDetails></VenueDetails>,
      },
      {
        path: "/create",
        element: (
          <ProtectedRoute>
            <CreateEvent></CreateEvent>
          </ProtectedRoute>
        ),
      },
      {
        path: "/managed-locations",
        element: (
          <ProtectedRoute>
            <ManagedLocations></ManagedLocations>
          </ProtectedRoute>
        ),
      },
      {
        path: "/managed-locations/:id",
        element: (
          <ProtectedRoute>
            <VenueDetailsEdit></VenueDetailsEdit>
          </ProtectedRoute>
        ),
      },
      {
        path: "/managed-events",
        element: (
          <ProtectedRoute>
            <ManagedEvents></ManagedEvents>
          </ProtectedRoute>
        ),
      },
      {
        path: "/managed-events/:id",
        element: <EventDetailsEdit></EventDetailsEdit>,
      },
      {
        path: "/managed-events/:id/edit",
        element: (
          <ProtectedRoute>
            <EditEvent></EditEvent>
          </ProtectedRoute>
        ),
      },
      {
        path: "/managed-artists",
        element: (
          <ProtectedRoute>
            <ManagedArtists></ManagedArtists>
          </ProtectedRoute>
        ),
      },
      {
        path: "/managed-artists/:id",
        element: (
          <ProtectedRoute>
            <ArtistDetailsEdit></ArtistDetailsEdit>
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <UserSetting></UserSetting>
          </ProtectedRoute>
        ),
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
