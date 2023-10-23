import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../MainLayout/MainLayout";
import Home from "../HomePage/Home";
import GoogleVarify from "../GoogleVarify/GoogleVarify";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <div>error page</div>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/google/callback",
        element: <GoogleVarify />,
      },
    ],
  },
]);
