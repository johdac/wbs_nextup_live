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
import { LocationDetails } from "./components/pages/LocationDetails";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { UserSetting } from "./components/pages/UserSetting";
import { EditEvent } from "./components/pages/EditEvent";
import { EventDetailsEdit } from "./components/pages/EventDetailsEdit";
import { LocationDetailsEdit } from "./components/pages/LocationDetailsEdit";
import { ArtistDetailsEdit } from "./components/pages/ArtistDetailsEdit";
import { EditArtist } from "./components/pages/EditArtist";
import NotFound from "./components/pages/notFound";
import { FavoritesPage } from "./components/pages/FavoritesPage";
import { EventArchivePage } from "./components/pages/EventArchivePage";
import { EditLocation } from "./components/pages/EditLocation";

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
        element: <EventDetails></EventDetails>,
      },
      {
        path: "/artist/:id",
        element: <ArtistDetails></ArtistDetails>,
      },
      {
        path: "/location/:id",
        element: <LocationDetails></LocationDetails>,
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
        path: "/managed-locations/",
        element: (
          <ProtectedRoute>
            <ManagedLocations></ManagedLocations>
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
        path: "/managed-locations/:id",
        element: (
          <ProtectedRoute>
            <LocationDetailsEdit></LocationDetailsEdit>
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
        path: "/managed-artists/:id/edit",
        element: (
          <ProtectedRoute>
            <EditArtist></EditArtist>
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
