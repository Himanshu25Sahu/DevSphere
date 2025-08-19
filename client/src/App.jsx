
import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { checkAuthStatus, logout } from "./Slices/authSlice.js";
import "./App.css";
import axios from "axios";
import { GlobalStyle } from "./styles/global.js";
import ModalProvider from "./context/ModalContext";
import PlaygroundProvider from "./context/PlaygroundContext";
import Loader from "./components/Loader/Loader.jsx";

// Lazy-loaded components
const Chat = React.lazy(() => import("./Pages/Chat/Chat.jsx"));
const Login = React.lazy(() => import("./Pages/Login/Login"));
const UserProfile = React.lazy(() => import("./Pages/UserProfile/UserProfile.jsx"));
const Home = React.lazy(() => import("./screens/Home"));
const Playground = React.lazy(() => import("./screens/Playground"));
const Error404 = React.lazy(() => import("./screens/Error404"));
const MainHome = React.lazy(() => import("./components/MainHome.jsx"));
const Feed = React.lazy(() => import("./Pages/Post/Feed.jsx"));
const AddFriend = React.lazy(() => import("./Pages/AddFriend/AddFriend.jsx"));
const GroupChat = React.lazy(() => import("./Pages/GroupChat/GroupChat.jsx"));
const Profile = React.lazy(() => import("./Pages/OthersProfile/Profile.jsx"));
const EditProfile = React.lazy(() => import("./Pages/UserProfile/EditProfile/EditProfile.jsx"));
const RegisterPage = React.lazy(() => import("./Pages/Register/Register.jsx"));
const DevProfile = React.lazy(() => import("./Pages/DevProfile/DevProfile.jsx"));
const Sidebar = React.lazy(() => import("./components/Navbar/Sidebar.jsx"));

axios.defaults.withCredentials = true;

// Consider adding error handling to the interceptor
axios.interceptors.request.use((config) => {
  try {
    if (document.cookie.indexOf('token') === -1) {
      const token = localStorage.getItem('fallbackToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Interceptor error:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

function Logout() {
  const dispatch = useDispatch();

// In your Logout component
useEffect(() => {
  dispatch(logout());
  localStorage.removeItem('fallbackToken'); // Clear fallback token
  
  axios.get(`${import.meta.env.VITE_BACKEND_BASEURL}/user/logout`, {
    withCredentials: true,
  })
  .finally(() => {
    window.location.replace("/login");
  });
}, [dispatch]);

  return null;
}



function App() {
  const [count, setCount] = useState(0);
  const { userData, loading, error,isAuthorized } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [authChecked, setAuthChecked] = useState(false);
  

useEffect(() => {
  const publicRoutes = ["/login", "/register"];
  if (publicRoutes.includes(window.location.pathname)) {
    setAuthChecked(true);
    return;
  }

  if (!isAuthorized) {
    dispatch(checkAuthStatus())
      .unwrap()
      .finally(() => setAuthChecked(true));
  } else {
    setAuthChecked(true);
  }
}, [dispatch, isAuthorized]);



  if (!authChecked || loading) {
    return <Loader />;
  }

  return (
    <Router>
        <Sidebar>

        
      <Suspense fallback={<Loader />}>
        <GlobalStyle />
        <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route
            path="/compile"
            element={
              userData ? (
                <PlaygroundProvider>
                  <ModalProvider>
                    <Home />
                  </ModalProvider>
                </PlaygroundProvider>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/playground/:folderId/:playgroundId"
            element={
              userData ? (
                <PlaygroundProvider>
                  <ModalProvider>
                    <Playground />
                  </ModalProvider>
                </PlaygroundProvider>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<MainHome />} />
          <Route path="/login" element={isAuthorized?<Navigate to="/post" />:<Login/>} />
          <Route path="/chat" element={userData ? <Chat /> : <Navigate to="/login" />} />
<Route
  path="/post"
  element={
    isAuthorized ? <Feed /> : <Navigate to="/login" replace />
  }
/>
          <Route path="/addChat" element={userData ? <AddFriend /> : <Navigate to="/login" />} />
          <Route path="/myProfile" element={userData ? <UserProfile /> : <Navigate to="/login" />} />
          <Route path="/logout" element={userData ? <Logout /> : <Navigate to="/login" />} />
          <Route path="/community" element={userData ? <GroupChat /> : <Navigate to="/login" />} />
          <Route path="/user/user-details" element={<Profile />} />
          <Route path="/user/Edit-profile" element={<EditProfile />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/devProfile" element={<DevProfile />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Suspense>
      </Sidebar>
    </Router>
  );
}

export default App;