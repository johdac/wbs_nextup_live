import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Landing } from "./components/pages/Landing";
import { Register } from "./components/pages/Register";
import { Login } from "./components/pages/Login";
import { SingleEventPage } from "./components/pages/SingleEventPage";
import { SingleArtistPage } from "./components/pages/SingleArtistPage";
import { CreateEvent } from "./components/pages/CreateEvent";
import { ManagedLocations } from "./components/pages/ManagedLocations";
import { ManagedEventsPage } from "./components/pages/ManagedEventsPage";
import { ManagedArtistsPage } from "./components/pages/ManagedArtistsPage";
import { SingleLocationPage } from "./components/pages/SingleLocationPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserSetting } from "./components/pages/UserSetting";
import { EditEvent } from "./components/pages/EditEvent";
import { EditArtist } from "./components/pages/EditArtist";
import NotFound from "./components/pages/notFound";
import { FavoritesPage } from "./components/pages/FavoritesPage";
import { EventArchivePage } from "./components/pages/EventArchivePage";
import { EditLocation } from "./components/pages/EditLocation";
import { ManagedLocationsPage } from "./components/pages/ManagedLocationsPage";

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
        element: <EventArchivePage></EventArchivePage>,
      },
      {
        path: "/event/:id",
        element: <SingleEventPage></SingleEventPage>,
      },
      {
        path: "/artist/:id",
        element: <SingleArtistPage></SingleArtistPage>,
      },
      {
        path: "/location/:id",
        element: <SingleLocationPage></SingleLocationPage>,
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
        path: "/managed-events",
        element: (
          <ProtectedRoute>
            <ManagedEventsPage></ManagedEventsPage>
          </ProtectedRoute>
        ),
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
            <ManagedArtistsPage></ManagedArtistsPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "/managed-artists/:id/edit",
        element: (
          <ProtectedRoute>
            <EditArtist></EditArtist>
          </ProtectedRoute>
        ),
      },
      {
        path: "/managed-locations/",
        element: (
          <ProtectedRoute>
            <ManagedLocationsPage></ManagedLocationsPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "/managed-locations/:id/edit",
        element: (
          <ProtectedRoute>
            <EditLocation></EditLocation>
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
      {
        path: "/favorites",
        element: (
          <ProtectedRoute>
            <FavoritesPage></FavoritesPage>
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <NotFound />,
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
