import { createBrowserRouter } from "react-router";
import { lazy } from "react";
import Root from "./pages/Root";
import Home from "./pages/Home";

// 라우트 lazy loading - 초기 번들 축소로 로딩 속도 개선
const BlogHome = lazy(() => import("./pages/BlogHome"));
const OnAir = lazy(() => import("./pages/OnAir"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const WritePost = lazy(() => import("./pages/WritePost"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const MyPage = lazy(() => import("./pages/MyPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
