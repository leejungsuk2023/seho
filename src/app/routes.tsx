import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import Home from "./pages/Home";
import BlogHome from "./pages/BlogHome";
import OnAir from "./pages/OnAir";
import PostDetail from "./pages/PostDetail";
import WritePost from "./pages/WritePost";
import SearchResults from "./pages/SearchResults";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyPage from "./pages/MyPage";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "blogs/:slug", Component: BlogHome },
      { path: "blogs/:slug/post/:id", Component: PostDetail },
      { path: "blogs/:slug/write", Component: WritePost },
      { path: "blogs/:slug/edit/:postId", Component: WritePost },
      { path: "on-air", Component: OnAir },
      { path: "search", Component: SearchResults },
      { path: "auth/login", Component: Login },
      { path: "auth/register", Component: Register },
      { path: "my-page", Component: MyPage },
      { path: "user/:id", Component: MyPage },
      { path: "admin", Component: AdminDashboard },
      { path: "*", Component: NotFound },
    ],
  },
]);
