import { createBrowserRouter } from "react-router";
import { AppLayout } from "./components/layout/AppLayout";
import { Landing } from "./components/pages/Landing";
import SignUp from "./components/pages/Signup";
import AuthLayout from "./components/layout/AuthLayout";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/signup", element: <SignUp /> },
      // { path: "/login", element: <LoginForm /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Landing></Landing>,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
    ],
  },
]);
